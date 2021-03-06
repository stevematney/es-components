/* eslint-env jest */

import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../util/test-utils';

import Drawer from './Drawer';

jest.mock('../../util/generateAlphaName', () => () => 'abcdef');

const buildDrawer = props => (
  <Drawer className="important" {...props}>
    <Drawer.Panel
      title="collapse 1"
      key="1"
      className="first"
      titleAside="side text"
    >
      first
    </Drawer.Panel>
    <Drawer.Panel title="collapse 2" key="2" className="second" noPadding>
      second
    </Drawer.Panel>
    <Drawer.Panel title="collapse 3" key="3" className="third">
      third
    </Drawer.Panel>
  </Drawer>
);

beforeEach(cleanup);

describe('drawer', () => {
  it('renders as expected', () => {
    const { container } = renderWithTheme(buildDrawer());
    expect(container).toMatchSnapshot();
  });

  it('opens a closed panel', () => {
    const onActiveKeysChanged = jest.fn();
    const { getByText } = renderWithTheme(buildDrawer({ onActiveKeysChanged }));

    getByText('collapse 1').click();

    expect(getByText('first')).toBeVisible();
    expect(getByText('second')).not.toBeVisible();
    expect(getByText('third')).not.toBeVisible();
  });

  it('allows multiple panels to be opened at the same time', () => {
    const onActiveKeysChanged = jest.fn();
    const { getByText } = renderWithTheme(buildDrawer({ onActiveKeysChanged }));

    getByText('collapse 1').click();
    getByText('collapse 3').click();

    expect(getByText('first')).toBeVisible();
    expect(getByText('second')).not.toBeVisible();
    expect(getByText('third')).toBeVisible();
  });

  it('closes a previously opened panel', async () => {
    jest.useFakeTimers();
    const onActiveKeysChanged = jest.fn();
    const { getByText } = renderWithTheme(buildDrawer({ onActiveKeysChanged }));

    const secondPanelToggle = getByText('collapse 2');
    secondPanelToggle.click();

    expect(getByText('second')).toBeVisible();

    secondPanelToggle.click();
    jest.runOnlyPendingTimers();
    expect(getByText('second')).not.toBeVisible();
  });

  it('allows drawers to be opened by default', () => {
    const onActiveKeysChanged = jest.fn();
    const { getByText } = renderWithTheme(
      buildDrawer({ activeKeys: ['1', '3'], onActiveKeysChanged })
    );

    expect(getByText('first')).toBeVisible();
    expect(getByText('second')).not.toBeVisible();
    expect(getByText('third')).toBeVisible();
  });
});

describe('accordion', () => {
  const isAccordion = true;

  it('renders as expected', () => {
    const { container } = renderWithTheme(buildDrawer({ isAccordion }));
    expect(container).toMatchSnapshot();
  });

  it('should only allow one drawer to be opened at a time', () => {
    jest.useFakeTimers();
    const onActiveKeysChanged = jest.fn();
    const { getByText } = renderWithTheme(
      buildDrawer({ isAccordion, onActiveKeysChanged, activeKeys: ['1'] })
    );

    expect(getByText('first')).toBeVisible();

    getByText('collapse 2').click();
    jest.runOnlyPendingTimers();

    expect(getByText('second')).not.toBeVisible();
  });
});
