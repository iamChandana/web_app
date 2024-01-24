import React from 'react';
import { shallow, mount } from 'enzyme';
import JointAccountContainer from '../index';

const renderJointAccountContainer = () => mount(
    <JointAccountContainer />
);

describe('Joint Account Holder component', () => {
    const renderedComponent = renderJointAccountContainer();
    const componentInstance = renderedComponent.instance();
    it('handles toggling of Joint Account holder type when user selects Main Account Holder', () => {
        componentInstance.handleJointAccountHolderName(1);
        expect(renderedComponent.state('mainHolder')).toBe(true);
        expect(renderedComponent.state('mainSecondaryHolder')).toBe(false);
    });

    it('handles toggling of Joint Account holder type when user selects Main/Secondary Account Holder', () => {
        componentInstance.handleJointAccountHolderName(2);
        expect(renderedComponent.state('mainHolder')).toBe(false);
        expect(renderedComponent.state('mainSecondaryHolder')).toBe(true);
    });
});
