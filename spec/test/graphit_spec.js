const firebase = require("firebase");
const { Graphit } = require("graphit");
const { Graphit_Firebase } = require('../../src/graphit-firebase.js');

var config = {
  apiKey: "AIzaSyDw44kycEYrMUc3RJ_WQ1Oe5ztZqx_S_is",
  authDomain: "graphit-js.firebaseapp.com",
  databaseURL: "https://graphit-js.firebaseio.com",
  projectId: "graphit-js",
  storageBucket: "graphit-js.appspot.com",
  messagingSenderId: "694181552879"
};
firebase.initializeApp(config);

let test_ref, g;

describe("Graphit integrado ao Firebase", function() {
  beforeAll(function() {
    test_ref = '__graphit-test__';
    g = new Graphit(new Graphit_Firebase(firebase.database(), test_ref));
  });

  afterAll(function() {
    firebase.database().ref(test_ref).remove();
  });
  
  describe('Graphit.node()', function() {
    describe(', quando não informado [id]', function() {
      it("e informado [obj], deve retornar instância de GNode com algum novo [id] e [obj] igual ao informado.", function() {
        const data = 'teste';
        return g.node({ data })
          .then(node => {
            expect(node.id).toEqual(jasmine.anything());
            expect(node.data).toEqual(data);
          })
          .catch((error) => fail(error));
      });

      it("e não informado [obj], deve retornar instância de GNode com novo [id] definido e [obj] indefinido.", function() {
        return g.node({})
          .then(node => {
            expect(node.id).toEqual(jasmine.anything());
            expect(node.data).toBeUndefined();
          })
          .catch((error) => fail(error));
      });
    });

    describe(', quando informado [id]', function() {
      it('e informado [obj], deve retornar instância de GNode com [id] e [obj] iguais aos informados.', function() {
        const data = Math.random();
        id = 0;
        return g.node({ id, data })
          .then(node => {
            expect(node.id).toEqual(id);
            expect(node.data).toEqual(data);
          })
          .catch((error) => fail(error));
      });

      describe('e não informado [obj]', function() {
        it('(id existente na base), deve retornar instância de GNode com [id] igual ao informado e [obj] igual ao existente na base.', async function() {
          const data = Math.random();
          new_obj = await g.node({ data });

          return g.node({ id: new_obj.id })
            .then(node => {
              expect(node.id).toEqual(new_obj.id);
              expect(node.data).toEqual(data);
            })
            .catch((error) => fail(error));
        });

        it('(id não existente na base), deve retornar instância de GNode com [id] igual ao informado e [obj] indefinido.', async function() {
          let new_obj, id;
          do {
            id = Math.ceil(Math.random() * 1000);
            new_obj = await g.node({ id });
          } while (new_obj.data != undefined);

          return g.node({ id })
            .then(obj => {
              expect(obj.id).toEqual(id);
              expect(obj.data).toBeUndefined();
            })
            .catch((error) => fail(error));
        });

      });
    });
  });

  describe('Graphit.adj(),', function() {
    describe('não informado [from_id],', () => {
      it('deve lançar erro.', function() {
        return g.adj({ list: [1] })
          .then(() => fail('Inserção indevida concluída com sucesso!'))
          .catch((error) => expect(() => { throw error; }).toThrowError());
      });
    });

    describe('informado [from_id],', function() {
      let from_id = 0;
      describe('informada [list],', function() {
        let list = [1, 2, 3];
        it('deve retornar AdjacencyList com [from_id] e [list] iguais aos informados.', () => {
          return g.adj({ from_id, list })
            .then(adj => {
              expect(adj.from_id).toEqual(from_id);
              expect(adj.list).toEqual(list);
            })
            .catch(error => fail(error));
        });
      });

      describe('não informada [list],', function() {
        describe('[from_id] inexistente,', () => {
          it('deve retornar AdjacencyList com [from_id] igual ao informado e [list] vazia.', async () => {
            await g.remove(from_id);
            return g.adj({ from_id })
              .then((adj) => {
                expect(adj.from_id).toEqual(from_id);
                expect(adj.list).toEqual([]);
              });
          });
        });

        describe('[from_id] existente,', () => {
          it('deve retornar AdjacencyList com [from_id] e [list] iguais à base.', async () => {
            const list = [1, 2, 3];
            const adj = await g.adj({ from_id, list });

            return g.adj({ from_id })
              .then(adj => {
                expect(adj.from_id).toEqual(from_id);
                expect(adj.list).toEqual(list);
              })
              .catch(error => fail(error));
          });
        });
      });
    });
  });

  describe('Graphit.remove()', () => {
    let id, data, list;
    beforeAll(async () => {
      data = Math.random();
      id = 0;
      list = [0, 1, 2];

      await g.node({ id, data });
      await g.adj({ from_id: id, list });
    });

    it("deve garantir inexistência de [id] na base após a remoção.", () => {
      return g.remove(id)
        .then(async () => {
          const node = await g.node({ id });
          expect(node.data).toBeUndefined();
        })
        .catch(error => fail(error));
    });
  });//*/
});