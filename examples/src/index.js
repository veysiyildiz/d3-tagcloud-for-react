
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import GithubCorner from 'react-github-corner';
import { Catalog, CodeSpecimen, ReactSpecimen, pageLoader } from 'catalog';
import DemoCloud from './DemoCloud';

import './styles.css';
import 'purecss/build/pure.css';

const documentationImports = {};


const pages = [
  {
    path: '/',
    title: 'Documentation',
    content: pageLoader(() => import('../../README.md')),
  },
  {
    path: '/demo',
    title: 'Demo',
    content: () => <DemoCloud />,
  }
];


ReactDOM.render(
  <Fragment>
    <GithubCorner
      href="https://github.com/veysiyildiz/skill-tag-cloud-for-react"
      bannerColor="#fff"
      octoColor="#000"
      width={80}
      height={80}
      direction="right"
    />
    <Catalog
      imports={documentationImports}
      pages={pages}
      styles={{display: 'block'}}
      theme={{ }}
      specimens={{
        javascript: props => <CodeSpecimen {...props} lang="javascript" />,
        js: props => <CodeSpecimen {...props} lang="javascript" />,
        jsx: props => <ReactSpecimen {...props} />,
      }}
      title="Skill Tag Cloud For React"
    />
  </Fragment>,
  document.getElementById('catalog'),
);
