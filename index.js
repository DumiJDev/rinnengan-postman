const swagger = document.getElementById('swagger')
const btnLimpa = document.getElementById('limpa')
const btnGerar = document.getElementById('gerar')
const resultados = document.getElementById('content')

const print = console.log
console.log = undefined

const operations = []

function limpar() {
  swagger.value = ''
  resultados.innerHTML = ''
  operations.splice(0, operations.length)
}

btnLimpa.addEventListener('click', limpar)
swagger.addEventListener('resize', (ev) => {
  print(document.getElementsByClassName('btn-container')[0])
})

const keys = (o) => Object.keys(o)

const indices = (paths) => {
  const keys1 = []

  for (const el of keys(paths)) {

    let key = { name: el, methods: [] }

    for (let method of keys(paths[el])) {
      if (method !== 'parameters')
        key.methods.push(method)
    }

    keys1.push(key)
  }

  return keys1
}

const popula = (name, status = 200, schema = []) => {
  operations.push({ name, status, schema })
}

const desenhaLista = () => {
  resultados.innerHTML = operations.map(o1 => `<div title="${o1.name} (${o1.status})" class="operation"><div>${(o1.name.length < 26 ? o1.name : o1.name.substring(0, 25) + '...')} (${o1.status})</div><button id="imprimir">baixar</button></div>`).join('')
}

function lerSwagger() {
  const paths = JSON.parse(swagger.value).paths

  const indexes = indices(paths)

  operations.splice(0, operations.length)

  for (let i of indexes)
    for (let m of i.methods) {
      const op = paths[`${i.name}`][`${m}`]

      for (let o of keys(op.responses)) {
        if (op.responses[o].examples)
          popula(op.operationId,
            parseInt(o),
            [...keys(op.responses[o].examples).map(key => op.responses[o].examples[key])]
          )
        else
          popula(op.operationId, parseInt(o))
      }

    }

  print(operations)
  desenhaLista()
}

btnGerar.addEventListener('click', lerSwagger)