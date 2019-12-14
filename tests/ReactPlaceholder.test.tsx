import * as React from 'react';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { flatten } from 'lodash';
import ReactPlaceholder from '../src/ReactPlaceholder';
import { shallow } from 'enzyme';

jest.useFakeTimers();

describe('ReactPlaceholder', () => {
  it('renders the text placeholder when the content is not ready', () => {
    const content = <div>Some content still loading...</div>;
    const tree = shallow(
      <ReactPlaceholder type="text" rows={2} ready={false}>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(false);
    expect(tree.getElements()).toMatchSnapshot();
  });

  it('renders the media placeholder when the content is not ready', () => {
    const content = <div>Some content still loading...</div>;
    const tree = shallow(
      <ReactPlaceholder type="media" rows={2} ready={false}>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(false);
    expect(tree.getElements()).toMatchSnapshot();
  });

  it('renders the textRow placeholder when the content is not ready', () => {
    const content = <div>Some content still loading...</div>;
    const tree = shallow(
      <ReactPlaceholder type="textRow" ready={false}>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(false);
    expect(tree.getElements()).toMatchSnapshot();
  });

  it('renders the rect placeholder when the content is not ready', () => {
    const content = <div>Some content still loading...</div>;
    const tree = shallow(
      <ReactPlaceholder type="rect" ready={false}>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(false);
    expect(tree.getElements()).toMatchSnapshot();
  });

  it('renders the round placeholder when the content is not ready', () => {
    const content = <div>Some content still loading...</div>;
    const tree = shallow(
      <ReactPlaceholder type="round" ready={false}>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(false);
    expect(tree.getElements()).toMatchSnapshot();
  });

  it('renders a custom placeholder when the content is not ready', () => {
    const content = <div>Some ready content</div>;
    const customPlaceholder = <div>Custom Placeholder</div>;
    const tree = shallow(
      <ReactPlaceholder ready={false} customPlaceholder={customPlaceholder}>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(false);
    expect(tree.getElements()).toMatchSnapshot();
  });

  it('renders the placeholder only after the specified delay', () => {
    const content = <div>Some content still loading...</div>;
    const tree = shallow(
      <ReactPlaceholder ready type="text" rows={2} delay={10000}>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(true);
    tree.setProps({ ready: false });
    tree.update();
    expect(tree.contains(content)).toBe(true);
    jest.runAllTimers();
    tree.update();
    expect(tree.contains(content)).toBe(false);
    expect(tree.getElements()).toMatchSnapshot();
  });

  it("renders the content when it's ready", () => {
    const content = <div>Some ready content</div>;
    const tree = shallow(
      <ReactPlaceholder type="text" rows={2} ready>
        {content}
      </ReactPlaceholder>
    );
    expect(tree.contains(content)).toBe(true);
    expect(tree.getElements()).toMatchSnapshot();
  });
});

describe('build', () => {
  it('build script generates every needed file', () => {
    execSync('npm run build', { stdio: [] });

    const libPath = path.resolve(__dirname, '../lib');

    const libFiles = fs.readdirSync(libPath);

    const files = flatten(
      libFiles.map(fileInRoot => {
        const filePath = path.resolve(libPath, fileInRoot);
        if (fs.lstatSync(filePath).isDirectory()) {
          return fs
            .readdirSync(filePath)
            .map(fileInFolder => `${fileInRoot}/${fileInFolder}`);
        }
        return fileInRoot;
      })
    );

    expect(files).toMatchSnapshot();
  });
});
