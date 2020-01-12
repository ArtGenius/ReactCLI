const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const args = minimist(process.argv);

const srcPath = [__dirname, '..', 'src'];
const arrPath = args.path.split('/');
const getRelativePath = (path) => {
  let result = path;
  arrPath.forEach(i => result = '../' + result);
  return result;
};
const pageDirs = {
	redux: [...arrPath, 'redux'],
	components: [...arrPath, 'Components'],
	connect: [...arrPath, 'connect'],
	state: [...arrPath, 'redux', 'state'],
	actions: [...arrPath, 'redux', 'actions'],
};
const pageFiles = [
  {
    path: [...pageDirs.components],
    templateName: 'Component.jsx',
    namePattern: '${componentName}Container.jsx'
  },
  {
    path: [...pageDirs.actions],
    templateName: 'actions.js',
    params: {
      trackApiRequestRelativePath: getRelativePath('../../../redux/action/makeTrackApiRequestActionCreator')
    }
  },
  {
    path: [...pageDirs.state],
    templateName: 'rootState.js',
    params: {
      requestsReducerRelativePth: getRelativePath('../../../../redux/state/requests')
    }
  },
  {
    path: [...arrPath],
    templateName: 'index.jsx',
  },
  {
    path: [...pageDirs.redux],
    templateName: 'createStore.js',
    params: {
      createReduxStoreRelativePath: getRelativePath('../../../redux/store/createReduxStore')
    }
  },
  {
    path: [...arrPath],
    namePattern: 'constants.js',
  }
];

const componentName = arrPath[arrPath.length - 1];

// create Component dir structure
const currentArray = [];
arrPath.forEach(element => {
  currentArray.push(element);
  const currentResolvePath = path.resolve(...srcPath, ...currentArray);
  if (!fs.existsSync(currentResolvePath)) {
    fs.mkdirSync(currentResolvePath);
  }
});

for (let dirName in pageDirs) {
  fs.mkdirSync(path.resolve(...srcPath, ...pageDirs[dirName]));
}

String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
}

//create files
pageFiles.forEach(file => {
  const templateFilePath = `cli/templates/${file.templateName}`;
  let fileCode = '';
  if (fs.existsSync(templateFilePath)) {
    const fileTemplate = fs.readFileSync(templateFilePath, 'utf8');
    const fileCode = fileTemplate.interpolate({
      componentName: componentName,
      ...file.params
    });
  }
  const filePath = [...srcPath, ...file.path];
  const fileName = file.namePattern ? file.namePattern.interpolate({componentName}) : file.templateName;

  fs.writeFileSync(path.resolve(...filePath, fileName), fileCode);
});