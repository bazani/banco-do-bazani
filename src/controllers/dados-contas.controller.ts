import { Request, Response } from "express";
import Controller from "../utils/decorators/controller.decorator";
import { Get } from "../utils/decorators/handlers.decorator";
import db from "../db/db";
import { format } from "date-fns";

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

export interface IExtrato {
  saldoAnterior: number;
  saldoFinal: number;
  movimentos: ILanctoExtrato[];
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

    const resposta: IExtrato = {
        saldoAnterior: 0,
        saldoFinal: 0,
        movimentos: []
    }

    db.getExtrato(contaId, dataIni.toString(), dataFim.toString())
        .then(extrato => {
            resposta.movimentos = extrato;
            res.json(resposta);
        });

  }

  public async doCredito(contaId: string, descricao: string, valor: number): Promise<boolean> {
    let resposta = false;
    const hoje = format(new Date(), 'yyyy-MM-dd');

    db.createLancamento(contaId, hoje, 'C', 15, descricao, valor)
        .then(() => {
            resposta = true;
        })
        .catch((err: any) => {
          console.error('Erro ao inserir lancamento', err);
        });

    return resposta;
  }

  public async doDebito(contaId: string, descricao: string, valor: number): Promise<boolean> {
    let resposta = false;
    const hoje = format(new Date(), 'yyyy-MM-dd');

    db.createLancamento(contaId, hoje, 'D', 120, descricao, valor)
        .then(() => {
            resposta = true;
        })
        .catch((err: any) => {
          console.error('Erro ao inserir lancamento', err);
        });

    return resposta;
  }
}
