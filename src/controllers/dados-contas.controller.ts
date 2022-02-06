import { Request, Response } from 'express';
import Controller from '../utils/decorators/controller.decorator';
import { Get } from '../utils/decorators/handlers.decorator';

export interface IDadoConta {
    saldoAtual: number;
    limite: number;
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
}

