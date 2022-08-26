let cart = []; // Variável para zerar a quantidade no modal;
let modalQt = 1; // Variável para zerar a quantidade no modal;
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);


// Listagem das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // Preencher as informações em pizzaItem

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML =`R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Não permitindo a tela recarregar ao clicar no link
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        // Procura o elemento mais próximo do item e pega seu index;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1; // Sempre que abrir o modal a Qt é definida como zero;
        modalKey = key;

        // Mostra as informações contidas na Array através da key criada
        console.log(pizzaJson[key]);

        console.log('Clicou na Pizza!')

        // Preenchendo as informações do modal através da key criada
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected'); // Remove o selected do tamanho G
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ //Em cada item

            if (sizeIndex == 2) {
                size.classList.add('selected') // Coloca selecionado em cada item
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });


        c('.pizzaInfo--qt').innerHTML = modalQt; // Coloca o valor na Qt do modal;
        
       
       
        // Gambiarra de tempo para a transição do Modal funcionar
        // Colocando um tempo para mudar a opacity de 0 para 1

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200)
    });

    // Mostra o fundo da area das pizzas
    c('.pizza-area').append(pizzaItem);
});

// Eventos do Modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
    
}
// Irá gerar um array | Faz funcionar os botões que fecham o Modal:
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
})

// Função do botão de menos 
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt>1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt; 
    }
})

// Função do botão de mais
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt; 
})

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ //Em cada item
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    })
});

// Adicionando ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size =parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    // A partir daqui perdi o sentido da vida kkkk
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier)
    if (key > -1 ) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    updateCart();
    closeModal();
})
// Menu mobile 
c('.menu-openner').addEventListener('click', ()=> {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ' ';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) { // Verifico se o id do item encontrado na PizzaJson é igual ao id do que está no carrinho
            let pizzaItem = pizzaJson.find((item=>item.id == cart[i].id))
            subtotal += pizzaItem.price * cart[i].qt;

            // Clonando o item
            let cartItem = c('.models .cart--item').cloneNode(true);

            // Para mostrar o tamanho ao lado do nome;

            let pizzaSizeName;

            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                break;
                case 1:
                    pizzaSizeName = 'M';
                break;
                case 2:
                    pizzaSizeName = 'G';
                break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            // Colocando a quantidade;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                } 
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++
                updateCart()
            })

            // Colocando o item clonado onde quero
            c('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;


        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw';
    }
}





/* 
    Compra de Pizzas 

    - (cloneNode(true)) Clona o contéudo selecionado | (true) O item e tudo que tem dentro;
    - (append()) Adiciona um item no local escolhido;
    - (const c = (el)=>{return document.querySelector(el)}) 
        ** Atalho para o (.querySelector);
        ** (const c = (el)=>document.querySelector(el)) Sem colchetes;

*/