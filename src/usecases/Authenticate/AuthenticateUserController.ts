import { Request, Response } from 'express';

import { AuthenticateService } from './AuthenticateService';

class AuthenticateUserController {
  async create(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;
    const authenticateService = new AuthenticateService();
    try {
      const { usuario } = await authenticateService.execute({
        email,
        password,
      });
      request.session.user = {
        id: usuario.id,
      };
      delete usuario.id;

      if (usuario.isAttend) response.redirect('atendimento');
      if (usuario.isAdmin) response.redirect('dashboard');
      response.redirect('painel');
    } catch (error) {
      response.render('index', { error });
    }
  }
  async index(request: Request, response: Response): Promise<void> {
    return response.render('index');
  }

  async exit(request: Request, response: Response): Promise<void> {
    request.session.destroy((err) => console.log(err));
    response.redirect('/');
  }
}

export { AuthenticateUserController };
