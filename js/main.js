let header = React.createClass({
    propTypes: {
    },
    render: function() {
        return(
            React.createElement('div', {className: 'page-header'},
                React.createElement('h1', {}, 'PUZZLES'))
        );
    }
});

let navMenu = React.createClass({
    render: function() {
        return (
            React.createElement('ul', {className: 'nav-menu'},
                React.createElement('li', {},
                    React.createElement('a', {href: '#'}, 'Drinks List')
                ),

                React.createElement('li', {},
                    React.createElement('a', {href: '#newItem'}, 'Create Your Own Drink')
                )
            )
        );
    }
});

let listItem = React.createClass({
    propTypes: {
        'id': React.PropTypes.number,
        'name': React.PropTypes.string.isRequired,
        'price': React.PropTypes.string.isRequired,
        'description': React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement('li', {},
                React.createElement('a', {className: 'nav-item-link', href: '#/item/' + this.props.id},
                    React.createElement('h2', {className: 'list-item-name'}, this.props.name),
                    React.createElement('div', {className: 'list-item-price'}, this.props.price))
            )
        );
    }
});

let listItems = React.createClass({
    propTypes: {
        'drinks': React.PropTypes.array.isRequired
    },

    render: function() {
        return (
            React.createElement('ul', {className: 'list-item-menu'}, this.props.drinks.map(i => React.createElement(listItem, i)))
        );
    }
});

let drinksPage = React.createClass({
    propTypes: {
        'drinks': React.PropTypes.array.isRequired
    },

    render: function() {
        return (
            React.createElement(listItems, {drinks: this.props.drinks})
        );
    }
});

let drinkDetails = React.createClass({
    propTypes: {
        'name': React.PropTypes.string.isRequired,
        'price': React.PropTypes.string.isRequired,
        'description': React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement('div', {className: 'list-item-menu-details'},
                React.createElement('p', {className: 'list-name-details'},this.props.name),
                React.createElement('p', {}, 'Price: ' + this.props.price),
                React.createElement('p', {}, 'Description: ' + this.props.description)
            )
        );
    }
});

let createDrink = React.createClass({
    propTypes: {
        'listItem': React.PropTypes.object.isRequired,
        'onChange': React.PropTypes.func.isRequired,
        'onAdd': React.PropTypes.func.isRequired
    },
    nameInput: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {name: e.target.value}));
    },
    priceInput: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {price: e.target.value}));
    },
    descriptionInput: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {description: e.target.value}));
    },
    onAdd: function() {
        this.props.onAdd(this.props.listItem);
    },
    render: function() {
        return (
            React.createElement('form', {},
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Name',
                    value: this.props.listItem.name,
                    onChange: this.nameInput
                }),
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Price',
                    value: this.props.listItem.price,
                    onChange: this.priceInput
                }),
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Description',
                    value: this.props.listItem.description,
                    onChange: this.descriptionInput
                }),
                React.createElement('button', {type: 'button', onClick: this.onAdd}, 'Create')
            )
        );
    }
});

let createDrinkPage = React.createClass({
    propTypes: {
        'listItem': React.PropTypes.object.isRequired,
        'onNewDrinkChange': React.PropTypes.func.isRequired,
        'onCreateNewDrink': React.PropTypes.func.isRequired
    },

    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(createDrink, {listItem: this.props.listItem, onChange: this.props.onNewDrinkChange, onAdd: this.props.onCreateNewDrink})
            )
        );
    }
});

let state = {};
let setState = function(changes) {
    let component;
    let componentProperties = {};

    Object.assign(state, changes);

    let splitUrl = state.location.replace(/^#\/?|\/$/g, '').split('/');

    switch(splitUrl[0]) {
    case 'item': {
        component = drinkDetails;
        componentProperties = state.drinks.find(i => i.key == splitUrl[1]);
        break;
    }

    case 'newItem': {
        component = createDrinkPage;
        componentProperties = {
            listItem: state.listItem,
            onNewDrinkChange: function (item) {
                setState({listItem: item});
            },
            onCreateNewDrink: function (item) {
                let itemList = state.drinks;
                const newKey = itemList.length + 1;
                itemList.push(Object.assign({}, {key: newKey, id: newKey}, item));
                setState({drinks: itemList, listItem: {name: '', description: '', price: ''}});
            }
        };
        break;
    }

    default: {
        component = drinksPage;
        componentProperties = {drinks: state.drinks};
    }
    }

    let rootElement = React.createElement('div', {},
        React.createElement(header, {}),
        React.createElement(navMenu, {}),
        React.createElement(component, componentProperties)
    );

    ReactDOM.render(rootElement, document.getElementById('react-app'));
};

window.addEventListener('hashchange', ()=>setState({location: location.hash}));

setState({listItem: {name: '', description: '', price: ''}, location: location.hash, drinks: drinks});