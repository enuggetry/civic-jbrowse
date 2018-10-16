
const sizeof = require('object-sizeof');
const stream = require('stream');


window.civicstream = new stream.Readable();
window.civicstream._read = () => {}; // redundant? see update below

var echoStream = new stream.Writable();
echoStream._write = function (chunk, encoding, done) {
  //console.log("chunk",chunk.toString());
  done();
};
window.civicstream.pipe(echoStream);


console.log("civic2gff");


window.civic = {    
    createStream:function(civicurl) {
        console.log('civic2gff createStream');        
        if (typeof window === 'undefined') {
            console.log("defining fetch");
            var fetch = require('node-fetch');
        }
        window.fetch(civicurl)
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            //console.log(JSON.stringify(myJson));
            parseCivic2gff(myJson);
        });
    }
};
function parseCivic2gff(db) {
    // => receive reconstructed POJO
    console.log("GFF filesize",sizeof(db));

    let linecount = 0;

    db.records.forEach(function(el) {
        //console.log(el.name);
        let i = {
            seqid:  'chr'+el.coordinates.chromosome,
            src:    'civicdb.org',
            type:   'SNV',
            start:  el.coordinates.start,
            end:    el.coordinates.stop,
            score:  '.',
            strand: '.',
            phase:  '.',
            attr:   'ID='+el.id+';'+
                    'Name='+el.name+';'+
                    'Alias='+el.entrez_name+';'+
                    (el.coordinates.reference_bases !== null ? 'ref='+el.coordinates.reference_bases+';': '') +
                    (el.coordinates.variant_bases !== null ? 'variant='+el.coordinates.variant_bases+';': '')

        };
        if (el.variant_types.length && typeof el.variant_types[0].so_id !== 'undefined' && el.variant_types[0].so_id !== 'N/A') 
            i.type = el.variant_types[0].so_id;

        let gffline = i.seqid+'\t'+i.src+'\t'+i.type+'\t'+i.start+'\t'+i.end+'\t'+i.score+'\t'+i.strand+'\t'+i.phase+'\t'+i.attr+'\n';

        window.civicstream.push(gffline);
        linecount++;
      });

      window.civicstream.push(null);
      
      console.log("GFF lines",linecount);

      //window.civicstream.pipe(echoStream);

}


if (typeof window === 'undefined') {
    let civicurl = "https://civicdb.org/api/variants/?count=100000";
    civicurl = "https://civicdb.org/api/variants?count=200";
    
    civic.createStream(civicurl);
}





var Stream = require('stream');

const Readable = require('stream').Readable;
const str = new Readable();
str._read = () => {}; // redundant? see update below
str.push('your text here big bit thing');
str.push(null);

var ws = new Stream;
ws.writable = true;
ws.bytes = 0;

ws.write = function(buf) {
   ws.bytes += buf.length;
}

ws.end = function(buf) {
   if(arguments.length) ws.write(buf);
   ws.writable = false;

   console.log('str writestream bytes length: ' + ws.bytes);
}

str.pipe(ws);



//88888888888888888888888888888888888888888888

//var stream = require('stream');
var echoStream = new Stream.Writable();
echoStream._write = function (chunk, encoding, done) {
  console.log(chunk.toString());
  done();
};
str.pipe(echoStream);
