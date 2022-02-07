import { Request, Response } from "express";
import Controller from "../utils/decorators/controller.decorator";
import { Get } from "../utils/decorators/handlers.decorator";
import db from "../db/db";

export interface IDadoConta {
  saldoAtual: number;
  limite: number;
}

export interface ILanctoExtrato {
  id: number;
  data: string;
  tipoLancto: string;
  codigoTipoOperacao: number;
  descricao: string;
  valor: number;
  saldo: number;
}

@Controller("/dados-conta")
export default class DadosContasController {
  private dadoConta1: IDadoConta = {
    saldoAtual: 341179.0,
    limite: 34000.0,
  };

  private dadoConta2: IDadoConta = {
    saldoAtual: 48455.11,
    limite: 43000.0,
  };

  private dadoConta3: IDadoConta = {
    saldoAtual: 700.0,
    limite: 85514.0,
  };

  @Get("/:contaId")
  public getDadoConta(req: Request, res: Response): void {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({mensagem: 'Falta o token para autenticacao'});
        return;
      }

    const { contaId } = req.params;
    let resposta = {};

    switch (contaId) {
      case "89f9448e":
        resposta = this.dadoConta1;
        break;

      case "b7a84e00":
        resposta = this.dadoConta2;
        break;

      case "e8e49a7b":
        resposta = this.dadoConta3;
        break;

      default:
        resposta = { mensagem: `Conta ${contaId} não encontrada.` };
        break;
    }

    if (!resposta.hasOwnProperty("mensagem")) {
      res.json(resposta);
    } else {
      res.status(404).json(resposta);
    }
  }

  @Get("/:contaId/extrato")
  public getExtrato(req: Request, res: Response): void {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({mensagem: 'Falta o token para autenticacao'});
        return;
      }

    if (!req.query.dataInicial) {
      res
        .status(400)
        .json({ mensagem: "Parametro dataInicial não encontrado!" });
      return;
    }

    if (!req.query.dataFinal) {
      res.status(400).json({ mensagem: "Parametro dataFinal não encontrado!" });
      return;
    }

    const dataIni = req.query.dataInicial;
    const dataFim = req.query.dataFinal;
    const { contaId } = req.params;

    const validDate = new RegExp('^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$');

    if (!validDate.test(dataIni.toString()) || !validDate.test(dataFim.toString())) {
      res
        .status(400)
        .json({ mensagem: "Informe a data no formato 2022-01-01" });
      return;
        
    }

    db.getExtrato(contaId, dataIni.toString(), dataFim.toString())
        .then(extrato => {
            res.json(extrato);
        });

  }

  public doCredito(contaId: string, valor: number): boolean {
    let resposta = false;

    return resposta;
  }

  public doDebito(contaId: string, valor: number): boolean {
    let resposta = false;

    return resposta;
  }
}
