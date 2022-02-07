import { Request, Response } from "express";
import Controller from "../utils/decorators/controller.decorator";
import { Post } from "../utils/decorators/handlers.decorator";
import AuthController from "./auth.controller";

export interface IPix {
  chave: string;
  valor: number;
}

@Controller("/pix")
export default class PixController {
  @Post("/:contaId/transferencia")
  public doTransferencia(req: Request, res: Response): void {
    // TODO: add logica, utilizando o controller da cc
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ mensagem: "Falta o token para autenticacao" });
      return;
    }

    const auth = new AuthController();

    const token = authHeader.split(" ")[1];
    const user = auth.getDadosToken(token);

    if (user.perfil !== 'CFO') {
      res.status(403).json({ mensagem: "Apenas o CFO pode fazer PIX." });
      return;
    }

    res.send("oooook");
  }

  @Post("/:contaId/cobranca")
  public doCobranca(req: Request, res: Response): void {
    // TODO: add logica, utilizando o controller da cc
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ mensagem: "Falta o token para autenticacao" });
      return;
    }
  }
}
