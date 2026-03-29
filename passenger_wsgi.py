import os
import sys
import asyncio
from io import BytesIO

sys.path.insert(0, os.path.dirname(__file__))

from server import app


def asgi_to_wsgi(asgi_app):
    """Convert an ASGI app to a WSGI app for Passenger."""
    def wsgi_app(environ, start_response):
        loop = asyncio.new_event_loop()
        try:
            scope = {
                'type': 'http',
                'asgi': {'version': '3.0'},
                'http_version': environ.get('SERVER_PROTOCOL', 'HTTP/1.1').split('/')[1],
                'method': environ.get('REQUEST_METHOD', 'GET'),
                'path': environ.get('PATH_INFO', '/'),
                'query_string': environ.get('QUERY_STRING', '').encode('latin-1'),
                'root_path': environ.get('SCRIPT_NAME', ''),
                'scheme': environ.get('wsgi.url_scheme', 'http'),
                'server': (
                    environ.get('SERVER_NAME', 'localhost'),
                    int(environ.get('SERVER_PORT', '80')),
                ),
                'headers': [],
            }

            for key, value in environ.items():
                if key.startswith('HTTP_'):
                    header_name = key[5:].lower().replace('_', '-').encode('latin-1')
                    scope['headers'].append((header_name, value.encode('latin-1')))
                elif key == 'CONTENT_TYPE' and value:
                    scope['headers'].append((b'content-type', value.encode('latin-1')))
                elif key == 'CONTENT_LENGTH' and value:
                    scope['headers'].append((b'content-length', value.encode('latin-1')))

            # ✅ FIX: Read only the exact content length, never unbounded .read()
            body = b''
            try:
                content_length = int(environ.get('CONTENT_LENGTH', 0) or 0)
                if content_length > 0:
                    wsgi_input = environ.get('wsgi.input')
                    if wsgi_input is not None:
                        body = wsgi_input.read(content_length)
            except (ValueError, TypeError, SystemError):
                body = b''

            status_code = None
            response_headers = []
            body_parts = []

            async def receive():
                return {'type': 'http.request', 'body': body, 'more_body': False}

            async def send(message):
                nonlocal status_code, response_headers
                if message['type'] == 'http.response.start':
                    status_code = message['status']
                    response_headers = [
                        (k.decode('latin-1'), v.decode('latin-1'))
                        for k, v in message.get('headers', [])
                    ]
                elif message['type'] == 'http.response.body':
                    body_parts.append(message.get('body', b''))

            loop.run_until_complete(asgi_app(scope, receive, send))

            from http.client import responses
            reason = responses.get(status_code, 'Unknown')
            start_response(f"{status_code} {reason}", response_headers)
            return [b''.join(body_parts)]
        finally:
            loop.close()

    return wsgi_app


application = asgi_to_wsgi(app)
