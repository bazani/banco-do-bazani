import connect, { sql } from "@databases/sqlite";

class Db {
  private db: any;

  constructor() {
    console.log("Conectando ao banco ...");
    this.db = connect("banco_do_banco.db");
  }

  public async prepare() {
    try {
      await this.createDb();
      await this.populateDb();
    } catch (err) {
      console.error("Whopsie", err);
      console.error("Finalizando api, erro ao conectaro ao banco.");
      process.exit(1);
    }
  }

  public async getExtrato(contaId: string, dataInicial: string, dataFinal: string): Promise<any> {
    const result = await this.db.query(sql`
        SELECT * FROM extrato
        WHERE contaId=${contaId}
        AND data BETWEEN ${dataInicial} AND ${dataFinal}
    `);
    return result;
  }

  public async createLancamento(contaId: string, data: string, tipo: string, 
                                codigoLancto: number, descricao: string,
                                valor: number): Promise<any> {
    const newId = await this.getNewId();

    const result = await this.db.query(sql`
        INSERT INTO extrato VALUES(
            ${newId},
            ${contaId},
            ${data},
            ${tipo},
            ${codigoLancto},
            ${descricao},
            ${valor},
            0
        )
    `);

    //const saldo = await this.calculaSaldo(contaId);

    return result;
  }

  private async getNewId(): Promise<number> {
    const result = await this.db.query(sql`
        SELECT max(id) as newId
        FROM extrato
    `);

    return result;
  }

  // private async calculaSaldo(contaId: string) {  }

  private async createDb() {
    console.log("Verificando estrutura ...");
    await this.db.query(sql`
            CREATE TABLE IF NOT EXISTS extrato(
                id INTEGER PRIMARY KEY,
                contaId TEXT,
                data TEXT,
                tipoLancto TEXT,
                codigoTipoOperacao INTEGER,
                descricao TEXT,
                valor REAL,
                saldo REAL
            );
        `);
  }

  private async populateDb() {
    const result = await this.db.query(sql`
            SELECT * FROM extrato LIMIT 1;
        `);
    //{id: '', agencia: '1337', contaCorrente: '65432-1'},

    if (!result.length) {
      console.log("Gerando massa para testes ...");
      await this.db.query(
        sql`INSERT INTO extrato VALUES(1, '89f9448e', '2022-01-01', 'D', 10, '', 135.55, 293210.23)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(2, '89f9448e', '2022-01-02', 'D', 13, '', 1203.00, 292007.23)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(3, '89f9448e', '2022-01-03', 'D', 702, '', 1232.20, 290775.03)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(4, '89f9448e', '2022-01-04', 'D', 9, '', 438.00, 290337.03)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(5, '89f9448e', '2022-01-05', 'C', 15, 'Chave: teste@minhaempresa.com', 19382.22, 309719.25)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(6, '89f9448e', '2022-01-07', 'D', 120, 'Chave: teste@meufornecedor.com', 235.44, 309483.81)`
      );

      await this.db.query(
        sql`INSERT INTO extrato VALUES(7, 'b7a84e00', '2022-01-01', 'D', 12, '', 135.55, 293210.23)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(8, 'b7a84e00', '2022-01-02', 'D', 8, '', 1203.00, 292007.23)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(9, 'b7a84e00', '2022-01-03', 'D', 9, '', 1232.20, 290775.03)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(10, 'b7a84e00', '2022-01-04', 'D', 10, '', 438.00, 290337.03)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(11, 'b7a84e00', '2022-01-05', 'C', 15, 'Chave: teste@minhaempresa.com', 19382.22, 309719.25)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(12, 'b7a84e00', '2022-01-07', 'D', 120, 'Chave: teste@meufornecedor.com', 235.44, 309483.81)`
      );

      await this.db.query(
        sql`INSERT INTO extrato VALUES(13, 'e8e49a7b', '2022-01-01', 'D', 10, '', 135.55, 293210.23)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(14, 'e8e49a7b', '2022-01-02', 'D', 231, '', 1203.00, 292007.23)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(15, 'e8e49a7b', '2022-01-03', 'D', 9, '', 1232.20, 290775.03)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(16, 'e8e49a7b', '2022-01-04', 'D', 14, '', 438.00, 290337.03)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(17, 'e8e49a7b', '2022-01-05', 'C', 11, '', 19382.22, 309719.25)`
      );
      await this.db.query(
        sql`INSERT INTO extrato VALUES(18, 'e8e49a7b', '2022-01-07', 'D', 120, 'Chave: teste@meufornecedor.com', 235.44, 309483.81)`
      );
    }
  }
}

export default new Db();
