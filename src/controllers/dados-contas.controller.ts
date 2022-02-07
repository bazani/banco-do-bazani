import { Request, Response } from 'express';
import Controller from '../utils/decorators/controller.decorator';
import { Get } from '../utils/decorators/handlers.decorator';

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

@Controller('/dados-conta')
export default class DadosContasController {
    private dadoConta1: IDadoConta = {
        saldoAtual: 341179.00,
        limite: 34000.00
    };

    private dadoConta2: IDadoConta = {
        saldoAtual: 48455.11,
        limite: 43000.00
    };

    private dadoConta3: IDadoConta = {
        saldoAtual: 700.00,
        limite: 85514.00
    };

    private extratoConta1: ILanctoExtrato[] = [
        {
            id: 10,
            data: "2022-01-01",
            tipoLancto: "D",
            codigoTipoOperacao: 10,
            descricao: "",
            valor: 120.15,
            saldo: 20391.22
        },
    ];

    @Get('/:contaId')
    public getDadoConta(req: Request, res: Response): void {
        const { contaId } = req.params;
        let resposta = {};
        
        switch(contaId) {
            case '89f9448e':
                resposta = this.dadoConta1;
                break;

            case 'b7a84e00':
                resposta = this.dadoConta2;
                break;

            case 'e8e49a7b':
                resposta = this.dadoConta3;
                break;

            default:
                resposta = {mensagem: `Conta ${contaId} não encontrada.`};
                break;
        }

        if (!resposta.hasOwnProperty('mensagem')){
            res.json(resposta);
        } else {
            res.status(404).json(resposta);
        }
    }

    @Get('/:contaId/extrato')
    public getExtrato(req: Request, res: Response): void {
        if (!req.query.dataInicial) {
            res.status(400).json({mensagem: 'Parametro dataInicial não encontrado!'});
            return;
        }

        if (!req.query.dataFinal) {
            res.status(400).json({mensagem: 'Parametro dataFinal não encontrado!'});
            return;
        }

        const dataIni = req.query.dataInicial;
        const dataFim = req.query.dataFinal;

        //res.json(this.extratoConta1);
        res.send(this.extratoConta1.toString());
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

