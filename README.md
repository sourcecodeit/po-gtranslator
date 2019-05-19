# po-gtranslator
An npm package for translating PO files using Google Translate API


# Usage:

node po-gtranslator.js --project_id={your google project id} --po_source={path of empty PO file} --po_dest={path of translated PO file} --mo={path of translated MO file} --lang={language code} 

Example: node po-gtranslator.js --project_id=example --po_source=/Users/diego/it-source.po --po_dest=/Users/diego/it.po --mo=/Users/diego/it.mo --lang=it

# Requirements

In order to use Google Translate API you need to setup a project in your Google Cloud Console, please check a simple guide here: https://cloud.google.com/translate/docs/quickstart-client-libraries

Feel free to fork the project and submit enhancements and fixes!

Proudly developed by [Diego Imbriani]([https:/](https://diegoimbriani.me/)) ([GreenTreeLabs](https://www.greentreelabs.net)) 💪
