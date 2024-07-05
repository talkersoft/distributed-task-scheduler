/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/Home.tsx */
import React from 'react';
import './home.scss';

const Home = () => {
  return (
    <div>
      <h1>Distributed Task Scheduler</h1>
      
      <div className="gazelle-logo">
        <svg
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 584.33 584.33"
        >
          <g>
            <g>
              <path
                d="M569.127,249.596c-3.378-5.77-5.671-12.195-8.172-18.442c-0.771-1.926-0.461-4.255-0.991-6.312
                    c-3.488-13.46-6.397-27.124-10.878-40.25c-2.848-8.352-7.715-16.112-12.338-23.737c-4.079-6.728-8.723-13.199-13.794-19.213
                    c-3.215-3.814-7.63-6.63-11.571-9.812c-11.02-8.899-20.946-18.438-19.645-35.998c-4.982,8.238-3.709,17.561,2.921,27.777
                    c5.071,7.813,10.584,15.341,17.181,24.843c-6.042-3.459-13.484-5.397-14.019-8.523c-1.021-5.957-6.01-5.063-8.531-7.026
                    c-16.234-12.64-16.5-12.297-24.023-31.037c-2.518,7.609-0.714,17.63,4.949,23.954c8.776,9.8,17.988,19.209,26.781,28.993
                    c12.803,14.248,25.549,28.581,32.33,48.683c-5.354-0.694-9.784-1.269-14.603-1.893c0.024-11.808,0.082-23.325-11.478-31.286
                    c-5.463,8.311-7.29,16.177-3.39,24.676c2.741,5.978,2.121,9.748-2.665,15.524c-7.694,9.286-12.407,21.016-18.601,31.583
                    c-6.866,11.714-12.692,24.435-21.595,34.357c-3.782,4.211-8.021,13.301-17.459,10.898c-0.759-0.192-2.105,0.608-2.717,1.338
                    c-7.866,9.331-19.498,8.646-29.812,11.746c-7.483,2.252-15.667,5.194-21.151,10.363c-8.727,8.226-18.4,12.383-29.833,14.105
                    c-16.895,2.545-33.709,5.63-50.62,8.045c-4.402,0.629-9.095-0.004-13.55-0.714c-11.261-1.786-22.53-3.64-33.672-6.03
                    c-16.859-3.619-33.913-6.781-50.303-11.967c-10.257-3.247-19.498-1.089-29.123,0.384c-16.03,2.456-32.003,5.284-47.989,8.021
                    c-1.44,0.245-2.795,0.983-5.541,1.983c12.064,4.936,22.599,2.252,33.276,0.656c12.644-1.893,25.394-3.231,38.14-4.227
                    c7.034-0.551,9.286,1.566,11.677,8.784c-3.574,0.828-7.091,1.804-10.661,2.439c-12.252,2.195-21.057,11.583-21.808,24.121
                    c-0.698,11.571-3.081,22.501-15.5,26.296c-6.145,1.877-14.251,2.6-19.808,0.117c-14.819-6.609-26.157-6.482-40.078,4.566
                    c-16.046,12.738-35.5,21.301-53.852,30.955c-6.577,3.459-14.219,4.99-21.485,6.988c-1.477,0.408-3.978-0.506-5.125-1.676
                    c-7.332-7.482-12.048-2.195-16.797,3.162c-1.212,1.371-2.224,2.916-3.207,4.219c0.314,0.859,0.392,1.709,0.681,1.787
                    c14.28,3.818,28.584,9.449,43.367,2.602c12.097-5.602,24.304-11.158,35.753-17.936c15.128-8.955,30.273-14.422,48.703-5.932
                    c-11.702,12.586-23.052,25.609-35.333,37.695c-7.324,7.209-17.52,11.811-23.778,19.686c-4.843,6.092-9.229,4.574-14.835,5.664
                    c-5.618,1.088-10.261,7.225-15.333,11.15c0.424,0.914,0.845,1.832,1.265,2.746c10.212-0.613,20.465-0.887,30.617-2.049
                    c2.832-0.322,5.663-2.938,7.988-5.059c14.064-12.82,28.625-25.186,41.73-38.932c9.743-10.225,20.449-12.57,33.896-11.791
                    c29.38,1.705,58.838,2.492,88.271,2.754c9.584,0.086,19.196-2.881,25.965-10.703c3.321-3.838,6.312-2.439,9.927-0.945
                    c47.475,19.588,94.897,16.545,142.066-0.967c7.658-2.844,14.264-8.887,22.02-11.021c7.45-2.047,15.892-1.949,23.676-1.008
                    c12.693,1.535,25.496,2.898,38.1,5.012c4.904,1.941,9.812,3.887,14.717,5.83c0.045,0.037,0.094,0.072,0.139,0.105
                    c-2.995,3.184-5.994,6.361-8.988,9.543c-0.412,0.438-0.755,0.887-1.045,1.348c-6.781,2.357-13.835,4.299-20.522,6.801
                    c-2.9,1.086-6.557,1.346-8.588,3.309c-5.492,5.305-11.73,3.598-17.193,1.75c-4.386-1.484-7.308-1.717-10.792,1.33
                    c-6.083,5.32-12.432,10.344-19.686,16.332c9.897,4.32,17.396,4.912,25.871,1.73c8.021-3.012,16.887-3.68,25.247-5.891
                    c21.967-5.818,43.15-12.795,64.606-20.262c1.024-0.363,1.886-0.865,2.611-1.461c2.469-0.559,4.766-1.727,6.332-3.623
                    c2.089-2.533,3.31-5.08,3.546-8.381c0.171-2.354-0.519-4.867-1.742-6.871c-1.812-2.969-5.268-4.426-8.539-3.785
                    c-5.056-4.072-10.11-8.145-15.166-12.217c-0.779-0.627-1.619-1.133-2.492-1.518c-13.844-11.773-29.915-17.576-48.487-17.453
                    c-1.228,0.008-2.46-0.584-3.423-0.828c2.032-19.238,7.353-36.357,19.05-52.062c8.303-11.146,12.676-25.194,18.988-37.858
                    c5.148-10.335,8.376-11.914,19.67-9.066c7.943,2.003,15.585,5.365,23.594,6.912c4.472,0.861,10.4,0.734,13.941-1.587
                    c6.019-3.949,11.013-10.037,5.663-18.131C577.928,261.595,572.868,255.989,569.127,249.596z"
              />
            </g>
          </g>
        </svg>
      </div>

      <i>We execute stuff really fast, like a gazelle.</i>
    </div>
  );
};

export default Home;
