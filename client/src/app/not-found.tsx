'use client';
import React from 'react';
import { Box, Typography, Button, SvgIcon, SvgIconProps } from '@mui/material';
import { useIntl } from 'react-intl';
import { useTheme, lighten } from '@mui/material';

const PageNotFoundIcon = (props: SvgIconProps) => {
  const fillColour = lighten(useTheme().palette.primary.main, 0.3);

  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="492" height="374" viewBox="0 0 492 374">
        <defs>
          <clipPath id="clip-GSB_Desktop_404">
            <rect width="492" height="374" />
          </clipPath>
        </defs>
        <g id="GSB_Desktop_404" data-name="GSB Desktop 404" clip-path="url(#clip-GSB_Desktop_404)">
          <g id="Group_10777" data-name="Group 10777" transform="translate(-714 -200.374)">
            <path id="Path_8883" data-name="Path 8883" d="M175.458,3.7c96.506,0,145.144,90.618,140.109,179.669s-67.6,185.506-164.1,185.506S-2.5,284.017,7.06,182.563,78.952,3.7,175.458,3.7Z" transform="translate(845.776 171.497) rotate(12)" fill={fillColour} />
            <path id="Path_1" data-name="Path 1" d="M1040.065,472.076c-.162-.283-.331-.555-.511-.835A2.731,2.731,0,0,1,1040.065,472.076Z" transform="translate(-3.318 -136.038)" fill="#194685" />
            <path id="Path_2" data-name="Path 2" d="M1027.3,645.443a2.726,2.726,0,0,1-.571.685C1026.93,645.9,1027.12,645.666,1027.3,645.443Z" transform="translate(1.413 -200.287)" fill="#194685" />
            <path id="Path_3" data-name="Path 3" d="M1015.878,610.473c-.086.086-.162.178-.24.264a1.261,1.261,0,0,1-.128.041C1015.632,610.671,1015.762,610.569,1015.878,610.473Z" transform="translate(5.55 -187.389)" fill="#194685" />
            <path id="Path_4" data-name="Path 4" d="M971.887,686.587a2.676,2.676,0,0,1-.647.276Z" transform="translate(21.877 -215.462)" fill="#194685" />
            <path id="Path_6" data-name="Path 6" d="M856.419,686.829a2.749,2.749,0,0,1-.708-.311C855.942,686.621,856.18,686.724,856.419,686.829Z" transform="translate(64.487 -215.436)" fill="#194685" />
            <path id="Path_7" data-name="Path 7" d="M807.241,652.943a2.623,2.623,0,0,1-.685-.714C806.768,652.472,807,652.715,807.241,652.943Z" transform="translate(82.616 -202.789)" fill="#194685" />
            <path id="Path_8" data-name="Path 8" d="M785.813,475.3c-.155.254-.3.514-.457.776A3.018,3.018,0,0,1,785.813,475.3Z" transform="translate(90.435 -137.533)" fill="#194685" />
            <path id="Path_8874" data-name="Path 8874" d="M637.55,519.333h23.477v21.883H637.55V590.2H611.9V541.216H532.194v-15.8l78.4-146.223H637.55Zm-76.952,0h51.3V419.049Z" transform="translate(183.806 -102.09)" fill="#413e3e" />
            <g id="Group_8829" data-name="Group 8829" transform="translate(716 277.106)">
              <rect id="Rectangle_6530" data-name="Rectangle 6530" width="79.705" height="5.049" transform="translate(0 156.97)" fill="#413e3e" />
              <path id="Path_8875" data-name="Path 8875" d="M624.808,422.336,567.2,535.243h6.37l51.243-100.455Z" transform="translate(-545.103 -395.107)" fill="#413e3e" />
              <path id="Path_8876" data-name="Path 8876" d="M703.814,601.219v16.833H680.337v48.983H658.474v5.049h25.651V623.1H707.6V601.219Z" transform="translate(-578.768 -461.082)" fill="#413e3e" />
              <rect id="Rectangle_6531" data-name="Rectangle 6531" width="3.787" height="140.137" transform="translate(101.569)" fill="#413e3e" />
            </g>
            <path id="Path_8877" data-name="Path 8877" d="M1205.55,519.333h23.477v21.883H1205.55V590.2H1179.9V541.216h-79.706v-15.8l78.4-146.223h26.955Zm-76.952,0h51.3V419.049Z" transform="translate(-25.683 -102.09)" fill="#413e3e" />
            <g id="Group_8831" data-name="Group 8831" transform="translate(1074.511 277.106)">
              <rect id="Rectangle_6532" data-name="Rectangle 6532" width="79.705" height="5.049" transform="translate(0 156.97)" fill="#413e3e" />
              <path id="Path_8878" data-name="Path 8878" d="M1192.808,422.336,1135.2,535.243h6.37l51.243-100.455Z" transform="translate(-1113.103 -395.107)" fill="#413e3e" />
              <path id="Path_8879" data-name="Path 8879" d="M1271.814,601.219v16.833h-23.477v48.983h-21.864v5.049h25.651V623.1H1275.6V601.219Z" transform="translate(-1146.768 -461.082)" fill="#413e3e" />
              <rect id="Rectangle_6533" data-name="Rectangle 6533" width="3.787" height="140.137" transform="translate(101.569)" fill="#413e3e" />
            </g>
            <path id="Path_8880" data-name="Path 8880" d="M100.471,0A100.471,100.471,0,1,1,0,100.471,100.471,100.471,0,0,1,100.471,0Z" transform="translate(859.2 289.193)" fill="#f0f0f0" />
            <path id="Path_9" data-name="Path 9" d="M350.6,249.464c6.27,14.081-3.487,32.1-21.792,40.253s-38.227,3.342-44.5-10.739,3.487-32.1,21.793-40.253S344.328,235.382,350.6,249.464Z" transform="translate(611.626 62.673)" fill="#fff" style={{ mixBlendMode: 'screen', isolation: 'isolate' }} />
            <path id="Path_10" data-name="Path 10" d="M414.395,347.68c-.861-4.941-4.087-20.8-11.769-33,3.122-14.408.628-32.588.04-36.429a78.75,78.75,0,0,0,8.318-5.454c-.328-.608-.663-1.21-1-1.811a74.48,74.48,0,0,1-8.277,5.454c-12.22-11.934-29.492-19.657-32.1-20.791-6.685-12.966-18.386-24.106-21.885-27.278a44.412,44.412,0,0,1,6.719-3.2c-1.012-.342-2.031-.663-3.056-.971a101.156,101.156,0,0,0-57.712,0c-1.025.308-2.043.629-3.055.971a44.408,44.408,0,0,1,6.718,3.2c-3.5,3.172-15.2,14.312-21.885,27.278-2.611,1.134-19.875,8.858-32.1,20.791a74.6,74.6,0,0,1-8.277-5.454c-.349.6-.683,1.21-1.011,1.818a78.624,78.624,0,0,0,8.325,5.447c-.588,3.841-3.082,22.022.041,36.429-7.682,12.2-10.908,28.057-11.77,33-2.085-1.339-4.483-3.205-6.008-4.428.253,1.086.526,2.173.813,3.246a100.368,100.368,0,0,0,26.635,45.628c.7.684,1.394,1.354,2.112,2.01a27.513,27.513,0,0,1,.567-7.43,144.37,144.37,0,0,0,33.538,5.954c1.613,1.408,10.17,8.331,33.19,18.9v9.371c.342.007.684.007,1.025.007s.684,0,1.025-.007v-9.371c23.019-10.574,31.576-17.5,33.19-18.9a143.8,143.8,0,0,0,33.538-5.96,27.024,27.024,0,0,1,.567,7.437c.717-.656,1.415-1.326,2.112-2.01A100.366,100.366,0,0,0,419.589,346.5c.288-1.073.561-2.16.814-3.246C418.879,344.475,416.479,346.341,414.395,347.68ZM299.448,229.233c2.064-.2,13.827-1.3,23.074-1.3s21.01,1.107,23.081,1.3c1.879,1.654,14.742,13.219,21.946,26.93-6.773,5.461-18,22.206-20.217,25.569a145.422,145.422,0,0,0-49.62,0c-2.221-3.363-13.451-20.108-20.217-25.569C284.7,242.453,297.561,230.888,299.448,229.233ZM287.924,390.589a140.425,140.425,0,0,1-33.354-6.1c-10.874-10.177-20.935-32.629-22.1-35.274.39-2.432,3.418-20.066,11.455-33.08,2.618.916,11.858,3.711,34.686,6.841,9.227,21.045,18.871,33.354,20.99,35.937C291.84,376.032,288.7,387.48,287.924,390.589Zm34.6-32.081c-8.284,0-18.96-.616-21.215-.753-1.723-2.078-11.483-14.3-20.853-35.678,2.016-3.882,15.638-30.292,17.627-38.329a143.4,143.4,0,0,1,48.882,0c1.989,8.038,15.611,34.447,17.627,38.329-9.371,21.38-19.13,33.6-20.853,35.678C341.482,357.892,330.806,358.508,322.522,358.508Zm67.951,25.978a140.149,140.149,0,0,1-33.354,6.1c-.779-3.11-3.916-14.558-11.68-31.679,2.118-2.584,11.763-14.893,20.989-35.937,22.828-3.13,32.069-5.925,34.687-6.841,8.037,13.006,11.065,30.647,11.454,33.08C411.408,351.856,401.354,374.308,390.473,384.485Z" transform="translate(637.15 69.193)" fill="#413e3e" />
            <path id="Path_11" data-name="Path 11" d="M396.287,255.679A100.478,100.478,0,0,1,255.679,396.287,100.476,100.476,0,1,0,396.287,255.679Z" transform="translate(623.437 53.429)" fill="#e3e3e3" style={{ mixBlendMode: 'multiply', isolation: 'isolate' }} />
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

const NotFoundPage = () => {
  const { formatMessage } = useIntl();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mt={5}>
      <Typography variant="h1" gutterBottom>{formatMessage({ id: '404.title' })}</Typography>
      <Typography mt={2} gutterBottom>{formatMessage({ id: '404.text' })}</Typography>
      <PageNotFoundIcon sx={{ fontSize: 300 }} />
      <Button variant="contained" size="large" href="/" sx={{ mt: 2 }}>{formatMessage({ id: '404.button' })}</Button>
    </Box>
  );
};

export default NotFoundPage;
