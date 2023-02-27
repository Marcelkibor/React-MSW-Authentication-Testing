import { rest, RestRequest } from 'msw';

type CustomRequestBodyType = Record<string, any> & {
  username: string;
  password: string;
};

export const handlers = [
  rest.get<RestRequest<CustomRequestBodyType>>('https://dev3.openmrs.org/openmrs/ws/rest/v1/session', (req, res, ctx) => {
    const { headers } = req;
    const authHeader = headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Basic ')) {
      const encodedCredentials = authHeader.slice(6);
      const decodedCredentials = atob(encodedCredentials);
      const [username, password] = decodedCredentials.split(':');

      if (username === 'Admin' && password === 'Admin123') {
        return res(
          ctx.status(200),
          ctx.json({
            authenticated: true,
            user: {
              username,
            },
          }),
        );
      } else {
        return res(
          ctx.status(401),
          ctx.json({
            error: 'Invalid credentials',
          }),
        );
      }
    } 
  }),
];
