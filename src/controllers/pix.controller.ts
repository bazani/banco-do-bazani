import { Request, Response } from "express";
import Controller from "../utils/decorators/controller.decorator";
import { Post } from "../utils/decorators/handlers.decorator";
import AuthController from "./auth.controller";
import DadosContasController from "./dados-contas.controller";

export interface IPix {
  chave: string;
  valor: number;
}

@Controller("/pix")
export default class PixController {
  @Post("/:contaId/transferencia")
  public doTransferencia(req: Request, res: Response): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ mensagem: "Falta o token para autenticacao" });
      return;
    }

    const auth = new AuthController();

    const token = authHeader.split(" ")[1];
    const user = auth.getDadosToken(token);

    if (user.perfil !== "CFO") {
      res.status(403).json({ mensagem: "Apenas o CFO pode fazer PIX." });
      return;
    }

    const { contaId } = req.params;

    const chave = req.body.chave;
    const valor = req.body.valor;

    if (!chave || !valor) {
      res
        .status(400)
        .json({
          mensagem: "Informe a chave e/ou valor no corpo da requisicao.",
        });
      return;
    }

    const dadosConta = new DadosContasController();
    dadosConta.doDebito(contaId, chave, valor)
        .then(() => res.status(201).send())
        .catch((err: any) => {
            console.error('Erro ao lancar debito:', err);
            res.status(500).json({mensagem: "Ocorreu um erro inesperado. Entre em contato com o suporte."});
        });
  }

  @Post("/:contaId/cobranca")
  public doCobranca(req: Request, res: Response): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ mensagem: "Falta o token para autenticacao" });
      return;
    }

    const auth = new AuthController();

    const token = authHeader.split(" ")[1];
    const user = auth.getDadosToken(token);

    if (user.perfil !== "CFO") {
      res.status(403).json({ mensagem: "Apenas o CFO pode fazer PIX." });
      return;
    }

    const { contaId } = req.params;

    const chave = req.body.chave;
    const valor = req.body.valor;

    if (!chave || !valor) {
      res
        .status(400)
        .json({
          mensagem: "Informe a chave e/ou valor no corpo da requisicao.",
        });
      return;
    }

    const dadosConta = new DadosContasController();
    dadosConta.doCredito(contaId, chave, valor)
        .then(() => res.status(201).send())
        .catch((err: any) => {
            console.error('Erro ao lancar credito:', err);
            res.status(500).json({mensagem: "Ocorreu um erro inesperado. Entre em contato com o suporte."});
        });
  }
}
