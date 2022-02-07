# Banco do Bazani

API que simula algumas operações de um banco digital. Utilizada para estudos de integração com um front-end.

---

# ENDPOINTS

## POST /auth/login

Realiza o login do usuario no sistema. A resposta é o token JWT que será utilizado nos demais endpoints para validar a permissao do usuario.  
O token expira a cada 2 minutos (120 segundos) e sera necessario obter um novo token no endpoint do refresh token.
Requisicao:

```
{
  "usuario": "cfo@minhaempresa.com",
  "senha": "senhaSuperSecreta"
}
```

Resposta:

```
{
  "nome": "Jose da Silva",
  "perfil": "CFO",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "refreshToken: "eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VUPWQZuClnkFbaEKCsPy7CZVMh5wxbCSpaAWFLpnTe9J0--PzHNeTFNXCrVHysAa3eFbuzD8_bLSsgTKC8SzHxRVSj5eN86vBPo_1fNfE7SHTYhWowjY4E_wuiC13yoj",
  "validade": 120
}
```

---

## POST /auth/refresh-token

Obtem um novo token utilizando o refresh token fornecido durante o login.

Requisicao:

```
{
  "refreshToken": ""eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VUPWQZuClnkFbaEKCsPy7CZVMh5wxbCSpaAWFLpnTe9J0--PzHNeTFNXCrVHysAa3eFbuzD8_bLSsgTKC8SzHxRVSj5eN86vBPo_1fNfE7SHTYhWowjY4E_wuiC13yoj"
}
```

Resposta:

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "refreshToken: "eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VUPWQZuClnkFbaEKCsPy7CZVMh5wxbCSpaAWFLpnTe9J0--PzHNeTFNXCrVHysAa3eFbuzD8_bLSsgTKC8SzHxRVSj5eN86vBPo_1fNfE7SHTYhWowjY4E_wuiC13yoj",
  "validade": 120
}
```

---

## GET /listar-contas

Retorna a lista de contas pertencentes ao usuario logado.

```
[
  {
    "id":"89f9448e",
    "agencia": "1234",
    "contaCorrente":"12345-6"
  }
]
```

---

## GET /dados-conta/$id_conta

Retorna os dados da conta corrente especifica

```
[
  {
    "saldoAtual":10123.45,
    "limite": 45000.00
  }
]
```

---

## GET /tipos-lancamentos

Retorna uma lista com os tipos de lancamentos que podem aparecer no extrato. Ex:

```
[
  {
    "codigo": 123,
    "descricao": "Tar Manut C/C"
  },
  {
    "codigo": 12,
    "descricao": "Deposito em cheque"
  },
  {
    "codigo": 11,
    "descricao": "Pagamento de boleto"
  }
]
```

---

## GET /dados-conta/$id_conta/extrato?dataInicial=2022-01-01&dataFinal=2022-01-31

Retorna o extrato da conta especificada, para o periodo informado utilizando os query parameters dataInicial e dataFinal.

```
{
  "saldoAnterior": 100.00,
  "saldoFinal": 230.00,
  "movimentos": [
    {
      "id":129012,
      "data": "2022-01-02",
      "tipoOperacao": "D",
      "codigoTipoTransacao": 123,
      "descricao": "Cesta de servicos premium"
      "valor": 45.43,
      "saldo": 234432.22
    },
    {
      "id":129013,
      "data": "2022-01-02",
      "tipoOperacao": "C",
      "codigoTipoTransacao": 12,
      "descricao": "Liberacao deposito em cheque"
      "valor": 4500.00,
      "saldo": 238932.22
    },
    {
      "id":129014,
      "data": "2022-01-03",
      "tipoOperacao": "D",
      "codigoTipoTransacao": 11,
      "descricao": "Pagamento de boleto"
      "valor": 28932.22,
      "saldo": 210000.00
    }
  ]
}
```

---

## POST /pix/$id_conta/transferencia

**ENDPOINT RESTRITO - apenas o CFO tem acesso**  
Realiza uma transferia (debito no extrato) via pix, para a chave de destino, utilizando os dados passados no body da requisicao.

```
{
  "chavePix": "email_destinatario@provedor-legal.com",
  "valor": 100.00
}
```

---

## POST /pix/$id_conta/cobranca

**ENDPOINT RESTRITO - apenas o CFO tem acesso**  
Realiza uma cobranca (credito no extrato) via pix, para a conta selecionada, utilizando os dados passados no body da requisicao.

```
{
  "chavePix": "pix@minhaempresa.com",
  "valor": 100.00
}
```
