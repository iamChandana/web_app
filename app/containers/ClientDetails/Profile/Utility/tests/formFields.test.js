import React from 'react';
import Radio from 'material-ui/Radio';
import { ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import { shallow, mount } from 'enzyme';
import { ContentItem, StyledPanel, StyledRadioButton, DisabledRadioButton, BolderText, StyledDetails } from '../formFields';
import { CustomIcon } from '../formFields';
import { required } from 'components/FormUtility/FormValidators';

const renderContentItem = (props = {}) => shallow(
    <ContentItem >
        {...props.children}
    </ContentItem>
);

const renderStyledPanel = (props = {}) => shallow(
    <StyledPanel >
        {...props.children}
    </StyledPanel>
);

const renderStyledRadioBtn = (props = {}) => shallow(
    <StyledRadioButton
        disabled
        checked
        value=""
        control={<Radio />}
        label="text"
        validate={[required]}>
        {...props.children}</StyledRadioButton>
);

const renderDisabledStyledRadioBtn = (props = {}) => shallow(
    <DisabledRadioButton
        disabled
        checked
        value=""
        control={<Radio />}
        label="text"
        validate={[required]}>
        {...props.children}</DisabledRadioButton>
);

const renderExpansionPanelSummary = () => shallow(
    <ExpansionPanelSummary expandIcon={<CustomIcon />} />
);

const renderMountStyledRadioBtn = (props = {}) => mount(
    <StyledRadioButton
        disabled
        checked
        value=""
        control={<Radio />}
        label="text"
        validate={[required]}>
        {...props.children}</StyledRadioButton>
);

const renderMountDisabledStyledRadioBtn = (props = {}) => mount(
    <DisabledRadioButton
        disabled
        checked
        value=""
        control={<Radio />}
        label="text"
        validate={[required]}>
        {...props.children}</DisabledRadioButton>
);

const renderCustomIcon = () => shallow(<CustomIcon />);

const renderBolderText = () => shallow(<BolderText />);

const renderStyledDetails = () => shallow(<StyledDetails />);

describe('<ContentItem />', () => {
    it('should render a div', () => {
        const wrapper = renderContentItem();
        expect(wrapper.type()).toEqual('div');
    });
});

describe('<StyledPanel />', () => {
    it('should have a prop for field expansion', () => {
        const expanded = false;
        const wrapper = renderStyledPanel({ expanded });
        expect(wrapper.props()).toBe(expanded);
    });
    it('should have exactly one child component', () => {
        const wrapper = renderStyledPanel();
        expect(wrapper.children().length).toEqual(1);

    });
});
describe('<StyledRadioButton/>', () => {
    const wrapper = renderStyledRadioBtn();
    const mountWrapper = renderMountStyledRadioBtn();
    it('should have a disabled prop to control the enable/disable property of the radio button', () => {
        expect(typeof (wrapper.props().disabled)).toBe('boolean');
    });

    it('should have a checked prop to display the checked/unchecked property of the radio button', () => {
        expect(typeof (wrapper.props().checked)).toBe('boolean');
    });

    it('should have a validate prop to validate the field', () => {
        expect(typeof (wrapper.props().validate)).toBe('object');
    });
    it('should have a control prop to render the fundamental component of the field', () => {
        expect(typeof (wrapper.props().control)).toBe('object');
    });
    it('expects to find a radio button', () => {
        expect(mountWrapper.find('input').length).toEqual(1);
    });

})

describe('<ExpansionPanelSummary/>', () => {
    const wrapper = renderExpansionPanelSummary();
    it('renders the expansion components without breaking', () => {
        expect(wrapper).toBeTruthy();
    });

    it('should have the expansion icon', () => {
        expect(wrapper.props().expandIcon).toBeTruthy();
    });
});

describe('<CustomIcon />', () => {
    const wrapper = renderCustomIcon();
    it('should render an image tag', () => {
        expect(wrapper.type()).toEqual('img');
    });
});

describe('<DisabledRadioButton/>', () => {
    const wrapper = renderDisabledStyledRadioBtn();
    const mountWrapper = renderMountDisabledStyledRadioBtn();
    it('should have a disabled prop to control the enable/disable property of the radio button', () => {
        expect(typeof (wrapper.props().disabled)).toBe('boolean');
    });

    it('should have a checked prop to display the checked/unchecked property of the radio button', () => {
        expect(typeof (wrapper.props().checked)).toBe('boolean');
    });

    it('should have a validate prop to validate the field', () => {
        expect(typeof (wrapper.props().validate)).toBe('object');
    });
    it('should have a control prop to render the fundamental component of the field', () => {
        expect(typeof (wrapper.props().control)).toBe('object');
    });
    it('expects to find a radio button', () => {
        expect(mountWrapper.find('input').length).toEqual(1);
    });
});

describe('<BolderText/>', () => {
    it('should render a span tag', () => {
        const wrapper = renderBolderText();
        expect(wrapper.type()).toBe('a');
    });
});
describe('<StyledDetails/>', () => {
    it('renders without breaking', () => {
        const wrapper = renderStyledDetails();
        expect(wrapper).toBeTruthy();
    });
});