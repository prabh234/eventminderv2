import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { Calendar, DownloadIcon, Loader2 } from 'lucide-react';
import { loveLight } from './fonts';

export function Certificate({
  data,
  certificateId,
}: {
  data: {
    id: number,
    event: {
      eventname: string,
      startdt: string,
      enddt: string,
      host: {
        fname: string,
        lname: string
      }
    },
    attendee: {
      fname: string
      lname: string
    }
  }
  certificateId: string
}) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

   const downloadAsPDF = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);

    try {
      // 1. Optimize canvas settings
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Reduced from 3 to 2 (good balance between quality and size)
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
        // Disable unnecessary features
        ignoreElements: (element) => {
          // Ignore decorative elements that don't affect content
          return element.classList.contains('opacity-10');
        }
      });

      // 2. Compress the image before PDF creation
      const imgData = canvas.toDataURL('image/jpeg', 0.85); // Using JPEG with 85% quality
      
      // 3. Create optimized PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      // 4. Further optimize the PDF
      pdf.setCreationDate(new Date());
      pdf.setLanguage('en-US');
      
      // Save with compression
      pdf.save(`${data.attendee.fname}_${data.attendee.lname}_certificate.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      {/* Certificate Container - optimized for PDF export */}
      <div
        ref={certificateRef}
        className="relative w-[297mm] h-[210mm] bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)',
          boxSizing: 'border-box'
        }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
        
        {/* Decorative elements */}
        <div className="absolute top-12 right-12 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="text-yellow-500">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
          </svg>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 h-full p-16 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="w-28 h-28 relative">
              <Image
                src="/emlogo2.png"
                alt="Logo"
                layout="fill"
                objectFit="contain"
                className="filter drop-shadow-sm"
                priority
              />
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Certificate ID</p>
              <p className="mt-1 text-lg font-mono font-bold text-gray-700 bg-gray-100 inline-block px-3 py-1 rounded-md">
                #{certificateId}
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-grow flex flex-col justify-center items-center text-center">
            <h1 className={`${loveLight.className} text-7xl font-bold text-gray-800 mb-6 relative pb-2`}>
              Certificate of Achievement
              <span className="absolute top-[120px] left-0 w-[570px] h-1 bg-gradient-to-r from-blue-400 to-purple-500"></span>
            </h1>
            
            <p className="text-xl text-gray-600 my-8 max-w-2xl leading-relaxed">
              This is to certify that <span className="font-semibold text-gray-800">{data.attendee.fname} {data.attendee.lname}</span> has successfully completed and demonstrated outstanding participation in:
            </p>
            
            <div className="my-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200 shadow-inner w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{data.event.eventname}</h2>
              <div className="flex justify-center space-x-6 text-gray-600 mt-4">
                <span className="flex items-center">
                  <Calendar className='w-5 h-5 mr-1'/>
                  {formatDate(data.event.startdt)} - {formatDate(data.event.enddt)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-left">
              <div className="border-t-2 border-gray-300 pt-3">
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-gray-700 font-medium">{formatDate(new Date().toString())}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block border-t-2 border-gray-300 pt-3 px-8">
                <p className="text-sm text-gray-500">Host Signature</p>
                <p className="text-gray-700 font-medium">{data.event.host.fname} {data.event.host.lname}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="border-t-2 border-gray-300 pt-3">
                <p className="text-sm text-gray-500">Certificate ID</p>
                <p className="text-gray-700 font-medium">#{certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
      onClick={downloadAsPDF}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg transition-all ${
        isGenerating ? 'opacity-75' : 'hover:from-blue-700 hover:to-purple-700 hover:scale-105'
      }`}
    >
      {isGenerating ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <DownloadIcon className="w-5 h-5" />
      )}
      <span className="font-semibold">
        {isGenerating ? 'Generating...' : 'Download Certificate'}
      </span>
    </button>
    </div>
  );
}

