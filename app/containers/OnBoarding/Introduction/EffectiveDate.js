import React from 'react';
import { RowGridRight } from 'components/GridContainer';
import { MirrorGridItemFlexEnd } from '../Components';
import EffectiveDatePicker from 'components/Kwsp/CustomComponents/EffectiveDateField';


export default function EffectiveDate() {
  return (
      <div style={{ marginTop: '20px' }}>
          <RowGridRight spacing={24}>
              <MirrorGridItemFlexEnd item xs={6}>
                  <EffectiveDatePicker />
                </MirrorGridItemFlexEnd>
            </RowGridRight>
        </div>
    );
}
