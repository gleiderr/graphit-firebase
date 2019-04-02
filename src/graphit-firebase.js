//Define operações com o database do Firebase
class Graphit_Firebase {

  constructor(database, reference) {
    this.database_ref = database.ref(reference);
    this.nodesRef = database.ref(reference).child('nodes');
    this.adjRef = database.ref(reference).child('adjacent_lists');

    this.retrieve_val = (id) => this.retrieve(id, this.nodesRef);
    this.retrieve_list = (id) => this.retrieve(id, this.adjRef);
    this.set_val = ({ id, data }) => this.set({ id, data }, this.nodesRef);
    this.set_list = ({ from_id, list }) => this.set({ id: from_id, data: list }, this.adjRef);
    this.new_id = () => this.nodesRef.push().key;
  }

  retrieve(id, ref) {
    return new Promise((resolve, reject) => {
      ref.child(id).on('value',
        (snapshot) => resolve(snapshot.val() == null ? undefined : snapshot.val()),
        (error) => reject(error));
    });
  }

  set({ id, data }, ref) {
    return ref.child(id).set(data);
  }

  //Remove objeto e lista de adjacência referenciados por [id].
  remove(id) {
    let aux = {};
    aux['/' + this.nodesRef.key + '/' + id] = null;
    aux['/' + this.adjRef.key + '/' + id] = null;

    return this.database_ref.update(aux);
  }
}

if(module) {
  module.exports.Graphit_Firebase = Graphit_Firebase;
}