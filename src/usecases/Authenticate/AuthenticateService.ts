import { AppError } from '@error/AppError';
import { prismaClient } from '@prisma';
import { compare } from 'bcrypt';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  usuario: {
    id: string;
    isAdmin: boolean;
    isAttend: boolean;
  };
}

class AuthenticateService {
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const usuario = await prismaClient.usuario.findFirst({
      where: { email },
    });

    if (!usuario) throw new AppError('Email ou Senha Incorreto');

    const conferirSenha = await compare(password, usuario.password);

    if (!conferirSenha) throw new AppError('Email ou Senha Incorreto');
    return {
      usuario: {
        id: usuario.id,
        isAdmin: usuario.isAdmin,
        isAttend: usuario.isAttend,
      },
    };
  }
}

export { AuthenticateService };
