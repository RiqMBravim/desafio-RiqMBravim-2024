const recintos = [
  { numero: 1, bioma: ["savana"], tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
  { numero: 2, bioma: ["floresta"], tamanhoTotal: 5, animais: [] },
  { numero: 3, bioma: ["savana", "rio"], tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
  { numero: 4, bioma: ["rio"], tamanhoTotal: 8, animais: [] },
  { numero: 5, bioma: ["savana"], tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1 }] },
  { numero: 6, bioma: ["floresta", "rio"], tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 2 }] },
  { numero: 7, bioma: ["floresta", "rio"], tamanhoTotal: 8, animais: [{ especie: "HIPOPOTAMO", quantidade: 1 }] }
];

const animaisPermitidos = {
  "LEAO": { tamanho: 3, bioma: ["savana"], carnivoro: true },
  "LEOPARDO": { tamanho: 2, bioma: ["savana"], carnivoro: true },
  "CROCODILO": { tamanho: 3, bioma: ["rio"], carnivoro: true },
  "MACACO": { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
  "GAZELA": { tamanho: 2, bioma: ["savana"], carnivoro: false },
  "HIPOPOTAMO": { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false },
};

const espacoNecessario = (especie) => animaisPermitidos[especie].tamanho;

const biomaAceito = (recinto, especie) => {
  return animaisPermitidos[especie].bioma.some(b => recinto.bioma.includes(b));
};

const espacoLivre = (recinto, especie, quantidade) => {
  let espacoOcupado = recinto.animais.reduce((total, animal) => {
    return total + espacoNecessario(animal.especie) * animal.quantidade;
  }, 0);

  espacoOcupado += espacoNecessario(especie) * quantidade;

  const maisDeUmaEspecie = recinto.animais.length > 0 && recinto.animais[0].especie !== especie;
  if (maisDeUmaEspecie) espacoOcupado += 1;

  const espacoLivreNoRecinto = recinto.tamanhoTotal - espacoOcupado;

  return espacoLivreNoRecinto >= 0 ? espacoLivreNoRecinto : false;
};

class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    if (!animaisPermitidos[animal]) {
      return { erro: "Animal inválido" };
    }

    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
      return { erro: "Quantidade inválida" };
    }

    let recintosViaveis = [];

    recintos.forEach(recinto => {
      if (biomaAceito(recinto, animal) && espacoLivre(recinto, animal, quantidade) !== false) {

        const animalEhCarnivoro = animaisPermitidos[animal].carnivoro;
        const recintoTemCarnivoros = recinto.animais.some(a => animaisPermitidos[a.especie].carnivoro);
        const recintoTemHipopotamo = recinto.animais.some(a => a.especie === 'HIPOPOTAMO');
        const haAnimaisNaoHipopotamos = recinto.animais.some(a => a.especie !== 'HIPOPOTAMO');


        if (recintoTemHipopotamo && (!recinto.bioma.includes("savana") || !recinto.bioma.includes("rio")) && animal !== 'HIPOPOTAMO') {
          return; // Se há um hipopótamo, o bioma deve ter tanto savana quanto rio para permitir convivência
        }

        if (animal === 'HIPOPOTAMO' && recinto.animais.some(a => a.especie !== 'HIPOPOTAMO')) {
            if ((recinto.bioma.includes("savana") && recinto.bioma.includes("rio")) == false) {
             return;
            }
        }

        if (animalEhCarnivoro && recinto.animais.length > 0) {
          if (recinto.animais[0].especie !== animal) return;
        }

        if (!animalEhCarnivoro && recintoTemCarnivoros) {
          return;
        }

        if (animal === 'MACACO' && quantidade === 1 && recinto.animais.length === 0) return;
        if (animal === 'MACACO' && quantidade === 1 && recinto.animais.length > 0) {
          const temHerbivoros = recinto.animais.some(a => !animaisPermitidos[a.especie].carnivoro);
          if (!temHerbivoros) return;
        }

        let espacoOcupado = recinto.animais.reduce((total, animal) => {
          return total + espacoNecessario(animal.especie) * animal.quantidade;
        }, 0);

        espacoOcupado += espacoNecessario(animal) * quantidade;

        const maisDeUmaEspecie = recinto.animais.length > 0 && recinto.animais[0].especie !== animal;
        if (maisDeUmaEspecie) espacoOcupado += 1;

        let espacoLivreNoRecinto = recinto.tamanhoTotal - espacoOcupado;

        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivreNoRecinto} total: ${recinto.tamanhoTotal})`);
      }
    });

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    } else {
      return { recintosViaveis };
    }
  }
}

const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 1);
console.log(resultado);

export { RecintosZoo };