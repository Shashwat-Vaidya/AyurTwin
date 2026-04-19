import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await userService.updateProfile(profileData);
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
    age: null,
    gender: null,
    bloodGroup: null,
    height: null,
    weight: null,
    bmi: null,
  },
  lifestyle: {
    physicalActivity: null,
    workType: null,
    dietType: null,
    smoking: false,
    alcohol: false,
    waterIntake: 2,
    junkFoodFrequency: 0,
    exerciseDuration: 0,
  },
  sleepMental: {
    sleepDuration: 7,
    sleepTime: null,
    wakeTime: null,
    daytimeSleepiness: 5,
    stressLevel: 5,
    anxietyLevel: 5,
  },
  familyHistory: {
    diabetes: false,
    heartDisease: false,
    hypertension: false,
    asthma: false,
    arthritis: false,
  },
  symptoms: {
    frequentThirst: false,
    frequentUrination: false,
    jointPain: false,
    breathingDifficulty: false,
    digestiveIssues: false,
    fatigueLevel: 5,
  },
  ayurvedicInputs: {
    digestionStrength: 5,
    appetiteLevel: 5,
    sweatingLevel: 5,
    temperaturePreference: null,
    stressResponse: null,
  },
  prakriti: {
    type: null,
    vata: 33.33,
    pitta: 33.33,
    kapha: 33.33,
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    setLifestyle: (state, action) => {
      state.lifestyle = { ...state.lifestyle, ...action.payload };
    },
    setSleepMental: (state, action) => {
      state.sleepMental = { ...state.sleepMental, ...action.payload };
    },
    setFamilyHistory: (state, action) => {
      state.familyHistory = { ...state.familyHistory, ...action.payload };
    },
    setSymptoms: (state, action) => {
      state.symptoms = { ...state.symptoms, ...action.payload };
    },
    setAyurvedicInputs: (state, action) => {
      state.ayurvedicInputs = { ...state.ayurvedicInputs, ...action.payload };
    },
    setPrakriti: (state, action) => {
      state.prakriti = { ...state.prakriti, ...action.payload };
    },
    calculateBMI: (state) => {
      const { height, weight } = state.personalInfo;
      if (height && weight && height > 0) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        state.personalInfo.bmi = Math.round(bmi * 10) / 10;
      }
    },
    calculateAge: (state, action) => {
      const dob = action.payload;
      if (dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        state.personalInfo.age = age;
      }
    },
    resetUserState: () => initialState,
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPersonalInfo,
  setLifestyle,
  setSleepMental,
  setFamilyHistory,
  setSymptoms,
  setAyurvedicInputs,
  setPrakriti,
  calculateBMI,
  calculateAge,
  resetUserState,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;