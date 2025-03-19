import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mic, Upload, Play, Square, Download } from 'lucide-react';
import { setConversionStatus } from '../store/slices/conversionSlice';
import type { RootState } from '../store';

const ConversionPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { currentConversion } = useSelector((state: RootState) => state.conversion);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        setAudioFile(file);
      };

      mediaRecorder.start();
      setIsRecording(true);
      dispatch(setConversionStatus({ status: 'recording' }));
    } catch (error) {
      console.error('Error accessing microphone:', error);
      dispatch(setConversionStatus({ 
        status: 'failed', 
        error: 'Failed to access microphone' 
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      dispatch(setConversionStatus({ status: 'idle' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleConversion = async () => {
    if (!audioFile) return;

    dispatch(setConversionStatus({ status: 'processing', progress: 0 }));

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed');

      const data = await response.json();
      dispatch(setConversionStatus({ 
        status: 'completed',
        progress: 100 
      }));
      
      // Handle successful conversion
      console.log('Conversion successful:', data);
    } catch (error) {
      dispatch(setConversionStatus({ 
        status: 'failed',
        error: 'Conversion failed. Please try again.' 
      }));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Convert Your Accent</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record or upload audio to convert it to a different accent
        </p>
      </header>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </button>

            <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {audioFile && (
            <div className="mt-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Play className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    {audioFile.name}
                  </span>
                </div>
                <button
                  onClick={handleConversion}
                  disabled={currentConversion.status === 'processing'}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {currentConversion.status === 'processing' ? (
                    'Converting...'
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      Convert
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentConversion.status === 'processing' && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                      Converting
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary-600">
                      {currentConversion.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                  <div
                    style={{ width: `${currentConversion.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentConversion.error && (
            <div className="mt-4 text-sm text-red-600">
              {currentConversion.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversionPage;