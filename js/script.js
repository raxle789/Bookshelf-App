const key = 'RAK_BUKU';
const loadingData = 'LOAD';
let data = [];
const listBelumSelesai = document.getElementById('belum');
const listSudahSelesai = document.getElementById('selesai');

document.addEventListener('DOMContentLoaded', function() {
  const tekanSubmit = document.getElementById('form1');
  tekanSubmit.addEventListener('submit', function(){
    if(periksaStorage()){
      tambahBuku();
    }
  });
  if(periksaStorage()){
    let dataTampil = JSON.parse(localStorage.getItem(key));
    if (dataTampil !== null) {
      for (const buku of dataTampil) {
        data.push(buku);
      }
    }
    const fieldCari = document.getElementById('searchBox');
    fieldCari.addEventListener('keyup', function(){
      cariData();
    });
    document.dispatchEvent(new Event(loadingData));
  }
});

document.addEventListener(loadingData, function(){
  listBelumSelesai.innerHTML = '';
  listSudahSelesai.innerHTML = '';

  for (const item in data) {
    const tempatItem = document.createElement('div');
    tempatItem.classList.add('TEMPAT_ITEM');
    const itemJudul = document.createElement('h3');
    itemJudul.innerText = data[item].title;
    const itemLain = document.createElement('p');
    itemLain.innerText = data[item].author + " | " + data[item].year;

    if (data[item].isComplete) {
      const tombolUndo = document.createElement('input');
      tombolUndo.setAttribute("type", "submit");
      tombolUndo.setAttribute("value", "Belum Selesai");
      tombolUndo.classList.add('TOMBOL_UNDO');
      tombolUndo.addEventListener('click', function(){
        data[item].isComplete = false;
        simpanData();
      });
      tempatItem.append(itemJudul, itemLain, tombolUndo);
    } else {
      const tombolCeklis = document.createElement('input');
      tombolCeklis.setAttribute("type", "submit");
      tombolCeklis.setAttribute("value", "Sudah Selesai");
      tombolCeklis.classList.add('TOMBOL_CEKLIS');
      tombolCeklis.addEventListener('click', function(){
        data[item].isComplete = true;
        simpanData();
      });
      tempatItem.append(itemJudul, itemLain, tombolCeklis);
    }
    const tombolHapus = document.createElement('input');
    tombolHapus.setAttribute("type", "submit");
    tombolHapus.setAttribute("value", "Hapus Buku");
    tombolHapus.classList.add('TOMBOL_HAPUS');
    tombolHapus.addEventListener('click', function(){
      const yakin = confirm("Apakah kamu yakin ingin menghapus?");
      if(yakin){
        data.splice(item, 1);
        simpanData();
      }
    });
    tempatItem.append(tombolHapus);

    if (!data[item].isComplete){
      listBelumSelesai.append(tempatItem);
    } else {
      listSudahSelesai.append(tempatItem);
    }
  }
});

function periksaStorage(){
  if (typeof(Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage, gunakanlah browser populer');
    return false;
  } else {
    return true;
  }
}

function generateObjek(id, title, author, year, isComplete){
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function tambahBuku(){
  const idBuku = +new Date();
  const judulBuku = document.getElementById('title').value;
  const penulisBuku = document.getElementById('author').value;
  const tahunBuku = document.getElementById('year').value;
  const checkBox = document.querySelector('#check');

  const objekBaru = generateObjek(idBuku, judulBuku, penulisBuku, tahunBuku, checkBox.checked);
  data.push(objekBaru);
  simpanData();
  event.preventDefault();
}

function simpanData(){
  localStorage.setItem(key, JSON.stringify(data));
  document.dispatchEvent(new Event(loadingData));
}

function cariIndex(id){
  for(const indeks in data){
    if(id == data[indeks].id){
      return indeks;
    }
  }
}

function updateCariData(){
  localStorage.setItem(key, JSON.stringify(data));
  cariData();
}

function cariData(){
  const cari = document.getElementById('searchBox').value;
  let arrayCari = data.filter(elemen => elemen.title.includes(cari));
  const hapus = document.querySelectorAll('.TEMPAT_ITEM');
  for(const item of hapus){
    item.remove();
  }

  listBelumSelesai.innerHTML = '';
  listSudahSelesai.innerHTML = '';
  for (const item in arrayCari) {
    const tempatItem2 = document.createElement('div');
    tempatItem2.classList.add('TEMPAT_ITEM');
    const itemJudul = document.createElement('h3');
    itemJudul.innerText = arrayCari[item].title;
    const itemLain = document.createElement('p');
    itemLain.innerText = arrayCari[item].author + " | " + arrayCari[item].year;

    if (arrayCari[item].isComplete) {
      const tombolUndo2 = document.createElement('input');
      tombolUndo2.setAttribute("type", "submit");
      tombolUndo2.setAttribute("value", "Belum Selesai");
      tombolUndo2.classList.add('TOMBOL_UNDO');
      tombolUndo2.addEventListener('click', function(){
        const target = cariIndex(arrayCari[item].id);
        data[target].isComplete = false;
        updateCariData();
      });
      tempatItem2.append(itemJudul, itemLain, tombolUndo2);
    } else {
      const tombolCeklis2 = document.createElement('input');
      tombolCeklis2.setAttribute("type", "submit");
      tombolCeklis2.setAttribute("value", "Sudah Selesai");
      tombolCeklis2.classList.add('TOMBOL_CEKLIS');
      tombolCeklis2.addEventListener('click', function(){
        const target = cariIndex(arrayCari[item].id);
        data[target].isComplete = true;
        updateCariData();
      });
      tempatItem2.append(itemJudul, itemLain, tombolCeklis2);
    }
    const tombolHapus2 = document.createElement('input');
    tombolHapus2.setAttribute("type", "submit");
    tombolHapus2.setAttribute("value", "Hapus Buku");
    tombolHapus2.classList.add('TOMBOL_HAPUS');
    tombolHapus2.addEventListener('click', function(){
      const yakin2 = confirm("Apakah kamu yakin ingin menghapus?");
      if(yakin2){
        const target = cariIndex(arrayCari[item].id);
        data.splice(target, 1);
        updateCariData();
      }
    });
    tempatItem2.append(tombolHapus2);

    if (!arrayCari[item].isComplete){
      listBelumSelesai.append(tempatItem2);
    } else {
      listSudahSelesai.append(tempatItem2);
    }
  }
}
