import React from 'react';
import ImgTakePhotoGuideHeader from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-header.png';
import ImgTakePhotoGuidePic1 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic1.png';
import ImgTakePhotoGuidePic2 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic2.png';
import ImgTakePhotoGuidePic3 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic3.png';
import ImgTakePhotoGuidePic4 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic4.png';
import ImgTakePhotoGuidePic5 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic5.png';
import ImgTakePhotoGuidePic6 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic6.png';
import ImgTakePhotoGuidePic7 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic7.png';
import ImgTakePhotoGuidePic8 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic8.png';
import ImgTakePhotoGuidePic9 from 'containers/OnBoarding/PersonalDetails/images/user-guide-take-photo-pic9.png';
import Dialog from 'components/Dialog';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

export default function PhotoGuideDialog(props) {
    return (
        <React.Fragment>
            <Dialog
                open={props.isOpenDialogGuideUploadPhoto}
                title={''}
                closeHandler={props.showDialogGuideUploadPhoto}
                content={
                    <React.Fragment>
                        <Grid container direction="column" justify="center" alignItems="center" style={{ marginBottom: '25px' }}>
                            <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                                <img src={ImgTakePhotoGuideHeader} />
                            </Grid>
                            <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                                <Text weight="bold">
                                    <Text color={Color.C_RED} display="inline" weight="bold">
                                        NOTE:
                                </Text>
                                    : Please clear your browser’s cache to make sure we have the updated caching in your browser.
                                </Text>
                                <Text>
                                    How-to Guide (Clear Cache):{' '}
                                    <a href="https://kb.iu.edu/d/ahic" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                                        https://kb.iu.edu/d/ahi
                                    </a>
                                </Text>
                            </Grid>
                            <Grid item xs={12} size="10px">
                                <Text>Take Photo for IC or Passport</Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginTop: '25px' }}>
                                <Text align="left">
                                    <b>Step 1:</b> Click on the "Take Photo" button.
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic1} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 2:</b> Take the photo and click on the “Circle” button as shown below.
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic2} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 3:</b> After taking the photo, a pop-up will show to verify if the image is blurred or not. If blurred
                                    or not clear click on the “Retake” button otherwise click on the "Ok" button to proceed.
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic3} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 4:</b> Do Step 3 for the rest of the images.
                                </Text>
                                <Text color={Color.C_RED} display="inline" weight="bold">
                                    NOTE:
                                </Text>{' '}
                                If you notice the image is still blurred, unclear or low quality you can click on the “Remove” hyperlink to
                                retake photo.
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <img src={ImgTakePhotoGuidePic4} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', paddingTop: '40px', paddingBottom: '40px' }}>
                                <hr style={{ border: '1px solid #EDEEEE' }} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 1:</b> Let’s start funding, click on the “Upload Document” button to select either Bank Draft/Cheque.
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic5} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 2:</b> In this guide, we selected Cheque, click on the “Upload” button.
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic6} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 3:</b> In this guide, we are using iPad(iOS) you will have a option to click on “Take Photo” button as
                                    default for iOS.
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic7} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 4:</b> Take the photo and confirm if it’s clear, if yes, click on the “Use Photo” button otherwise
                                    click on the “Retake” button
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic8} />
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px' }}>
                                <Text align="left">
                                    <b>Step 5:</b> Once done uploading the Cheque/Bank Draft, fill up the details needed then click on the
                                    “Submit” button.
                                </Text>
                            </Grid>
                            <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                                <img src={ImgTakePhotoGuidePic9} />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                }
            />
        </React.Fragment>
    );
}
