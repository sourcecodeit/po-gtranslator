/*
 * Read https://cloud.google.com/translate/docs/quickstart-client-libraries
 * for Google APIs authentication
 */


const fs = require('fs')
var gettextParser = require("gettext-parser");
var sleep = require('sleep');
const args = require('yargs').argv;
var colors = require('colors');

// Your Google Project Id
const projectId = args.project_id

// PO source file
const po_source_path = args.po_source

// PO backup file
const po_bkp_path = po_source_path + ".backup"

// PO destination file
const po_path = args.po_dest

// MO destination file
const mo_path = args.mo

// Target language
const target = args.lang;

if(! (projectId && po_source_path && po_bkp_path && po_path && mo_path && target)) {
  showHelp()
  process.exit(-1)
}

if(! process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  showGoogleHelp();
  process.exit(-1)
}

function showHelp() {
  let usage = "Usage: node " + args.$0 + " --project_id={your google project id} "
  usage += "--po_source={path of empty PO file} "
  usage += "--po_dest={path of translated PO file} "
  usage += "--mo={path of translated MO file} "
  usage += "--lang={language code} "
  console.log(usage.red)

  console.log("")
  let example = "Example: node " + args.$0 + " --project_id=example "
  example += "--po_source=/Users/diego/it-source.po "
  example += "--po_dest=/Users/diego/it.po "
  example += "--mo=/Users/diego/it.mo "
  example += "--lang=it"

  console.log(example)  
}

function showGoogleHelp() {
  console.log("Environment variable GOOGLE_APPLICATION_CREDENTIALS is empty".red)
  console.log("Help: https://cloud.google.com/translate/docs/quickstart-client-libraries")
}


async function tr(text) {
  // Imports the Google Cloud client library
  const {Translate} = require('@google-cloud/translate');

  // Instantiates a client
  const translate = new Translate({projectId});

  const [translation] = await translate.translate(text, target);
  
  return translation
}

async function start() {
  var input = require('fs').readFileSync(po_source_path);
  var po = gettextParser.po.parse(input);

  for(let k in po.translations['']) {
    
    if(po.translations[''][k] && 
      po.translations[''][k].msgstr && 
      po.translations[''][k].msgstr[0] == '') {
      
      let translation = await tr(k)
      console.log(k.yellow + "\n" + translation.cyan + "\n")
      po.translations[''][k].msgstr[0] = translation
      
      if(! po.translations[''][k].comments)
        po.translations[''][k].comments = {}

      po.translations[''][k].comments.translator = "automatic translation"

      let output_po = gettextParser.po.compile(po);
      fs.writeFileSync(po_bkp_path, output_po);

      // sleep to avoid flooding the Google APIs
      sleep.msleep(500)
    }
  } 
  
  var output = gettextParser.mo.compile(po);
  var output_po = gettextParser.po.compile(po);

  fs.writeFileSync(mo_path, output);
  fs.writeFileSync(po_path, output_po);
}

start()
