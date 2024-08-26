from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configurações do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://kferreira:7581@localhost/gestor'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de exemplo
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<Item {self.name}>'

# Cria as tabelas no banco de dados
with app.app_context():
    db.create_all()

@app.route('/items', methods=['POST'])
def add_item():
    data = request.json
    item_name = data.get('name')
    if not item_name:
        return jsonify({'error': 'Name is required'}), 400

    new_item = Item(name=item_name)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({'id': new_item.id, 'name': new_item.name}), 201

@app.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([{'id': item.id, 'name': item.name} for item in items])

if __name__ == '__main__':
    app.run(debug=True)
