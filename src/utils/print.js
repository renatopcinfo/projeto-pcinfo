export class Print {
  constructor(dadosParaImpressao) {
    this.dadosParaImpressao = dadosParaImpressao;
  }

  async PreparaDocumento() {
    const corpoDocumento = this.CriaCorpoDocumento();
    const documento = this.GerarDocumento(corpoDocumento);
    return documento;
  }

  CriaCorpoDocumento() {
    const header = [
      { text: 'CLIENTE', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'ASSUNTO', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'STATUS', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      //{ text: 'COMPLEMENTO', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      //{ text: 'CRIADO EM', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
    ];
    const body = this.dadosParaImpressao.map((item) => {
      return [
        { text: item.cliente, fontSize: 8 },
        { text: item.assunto, fontSize: 8 },
        { text: item.status, fontSize: 8 },
        //{ text: item.complemento, fontSize: 8 },
        // { text: item.createdFormated, fontSize: 8 },
      ];
    });

    const lineHeader = [
      {
        text: '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
        alignment: 'center',
        fontSize: 5,
        colSpan: 3,
      },
      {},
      {},
    ];

    let content = [header, lineHeader];
    content = [...content, ...body];
    return content;
  }

  GerarDocumento(corpoDocumento) {
    const documento = {
      pageSize: 'A4',
      pageMargins: [14, 53, 14, 48],
      header: function () {
        return {
          margin: [14, 12, 14, 0],
          layout: 'noBorders',
          table: {
            widths: ['*'],
            body: [[{ text: 'RELATÓRIO DE CHAMADOS', style: 'reportName' }]],
          },
        };
      },
      content: [
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 55],

            body: corpoDocumento,
          },
        },
      ],
      footer(currentPage, pageCount) {
        return {
          layout: 'noBorders',
          margin: [14, 0, 14, 22],
          table: {
            widths: ['auto'],
            body: [
              [
                {
                  text: '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                  alignment: 'center',
                  fontSize: 5,
                },
              ],
              [
                [
                  {
                    text: `Página ${currentPage.toString()} de ${pageCount}`,
                    fontSize: 7,
                    alignment: 'right',
                    /* horizontal, vertical */
                    margin: [3, 0],
                  },
                  {
                    text: '© Pc Info',
                    fontSize: 7,
                    alignment: 'center',
                  },
                ],
              ],
            ],
          },
        };
      },
      styles: {
        reportName: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
          margin: [0, 4, 0, 0],
        },
      },
    };
    return documento;
  }
}
