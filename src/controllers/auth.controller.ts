import { Request, response, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Controller from '../utils/decorators/controller.decorator';
import { Post } from '../utils/decorators/handlers.decorator';
import { random } from '../utils/random';
import config from '../utils/auth.config';

export interface IUser {
  nome: string;
  perfil: string;
}

export interface IToken {
  token: string;
  refreshToken: string;
  validade: number;
}

export interface ITokenRef {
  usuario: IUser;
  refreshToken: string;
}

interface IAuth extends IUser, IToken {}

// TODO: atualizar README.md com os novos payloads de resposta

@Controller('/auth')
export default class AuthController {
  private tokensRef: ITokenRef[] = [];

  @Post('/login')
  public async login(req: Request, resp: Response) {
    if (req.body.usuario && req.body.senha) {
      const user = req.body.usuario;
      const passd = req.body.senha;

      switch (user) {
        case 'cfo@minhaempresa.com':
          if (passd === 'senhaForte') {
            const resposta: IAuth = {
              nome: "Jose da Silva",
              perfil: "CFO",
              token: '',
              refreshToken: '',
              validade: 0
            } 

            const token: IToken = await this.createToken(resposta);
            resposta.token = token.token;
            resposta.refreshToken = token.refreshToken;
            resposta.validade = token.validade;

            resp.status(201).json(resposta);
          } else {
            resp.status(401).json({mensagem: 'Usuário ou senha inválidos!'});
          } 
          break;

        case 'usuario@minhaempresa.com':
          if (passd === 'senhaFraca') {
            const resposta: IAuth = {
              nome: "Joao da Silva",
              perfil: "usuario",
              token: '',
              refreshToken: '',
              validade: 0
            } 

            const token: IToken = await this.createToken(resposta);
            resposta.token = token.token;
            resposta.refreshToken = token.refreshToken;
            resposta.validade = token.validade;

            resp.status(201).json(resposta);
          } else {
            resp.status(401).json({mensagem: 'Usuário ou senha inválidos!'});
          } 
          break;
      
        default:
          resp.status(403).json({mensagem: 'Usuário não possui acesso ao sistema.'});
          break;
      }
    } else {
      resp.status(400).json({mensagem: 'Falta usuario ou senha na requisicao, ou eles estao em branco!'});
    }
  }

  @Post('/logout')
  public logout(resp: Response): void {
    this.tokensRef = [];
    resp.status(201);
  }

  @Post('/refresh-token')
  public async refreshToken(req: Request, resp: Response) {

    if (req.body.refreshToken) {
      const refreshToken = req.body.refreshToken;

      const hasToken = this.tokensRef.find(t => t.refreshToken === refreshToken);
      
      if (hasToken) {
        const token: IToken = await this.createToken(hasToken.usuario);
        resp.status(201).json(token);
      }
    }
    
    resp.status(401).json({mensagem: 'Refresh token nao encontrado ou expirado.'});
  }

  public isLogedIn(): boolean {
    return this.tokensRef.length > 0;
  }

  public getDadosToken(token: string): any {
    const userData = jwt.verify(token, config.secret);
    return userData;
  }

  private async createToken(usuario: IUser): Promise<IToken> {
    const jwtToken = jwt.sign(usuario, config.secret, {
      expiresIn: config.timeToExpire
    });

    const refreshToken = random(64);

    const resposta: IToken = {
      token: jwtToken,
      refreshToken: refreshToken,
      validade: config.timeToExpire
    };

    this.tokensRef.push({
      usuario: usuario,
      refreshToken: refreshToken
    });

    return resposta;
  }
}
