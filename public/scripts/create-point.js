function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
    fetch(url)
        //.then( (res) => { return res.json() })
        .then(res => res.json())
        .then(states => {

            for (const state of states) {
                ufSelect.innerHTML = ufSelect.innerHTML + `<option value="${state.id}">${state.nome}</option`
            }

        })
}

populateUFs()


function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    fetch(url)
        //.then( (res) => { return res.json() })
        .then(res => res.json())
        .then(cities => {

            citySelect.innerHTML = "<option value>Selecione a cidade</option>"
            citySelect.disabled = true

            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option`
            }

            citySelect.disabled = false

        })
}


document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


//Itens de coleta
//pegar todos os li's
const itensToCollect = document.querySelectorAll(".itens-grid li")

for (const item of itensToCollect) {
    item.addEventListener("click", handleSelectedItem)
}



const collectedItens = document.querySelector("input[name=itens]")
//
let selectedItens = []


function handleSelectedItem() {
    const itemLi = event.target

    //adicionar ou remover uma classe com Js
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id



    //verificar se existem itens selecionados, se sim    
    //pegar os itens selecionados
    const alreadySelected = selectedItens.findIndex(function (item) {
        const itemFound = item == itemId    //true or false
        return itemFound
    })



    //se já estiver selecionado
    if (alreadySelected >= 0) {
        //tirar da seleção
        const filteredItems = selectedItens.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItens = filteredItems
    } else {

        //se não estiver selecioando, adicionar à seleção
        selectedItens.push(itemId)
    }

    //atualizar o campo escondido com os itens selecionados
    collectedItens.value = selectedItens
}