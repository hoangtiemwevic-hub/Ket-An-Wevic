
import React, { useState, useRef, useCallback, useEffect } from 'react';

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImageCombinerPage: React.FC = () => {
    const [frameImage, setFrameImage] = useState<string | null>(null);
    const [personImage, setPersonImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (setter: React.Dispatch<React.SetStateAction<string | null>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setter(e.target?.result as string);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const drawImages = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        if (!frameImage) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        const frameImg = new Image();
        frameImg.src = frameImage;
        frameImg.onload = () => {
            canvas.width = frameImg.width;
            canvas.height = frameImg.height;
            ctx.drawImage(frameImg, 0, 0);

            if (personImage) {
                const personImg = new Image();
                personImg.src = personImage;
                personImg.onload = () => {
                    // Scale person image to fit within 40% of the frame's smaller dimension
                    const maxPersonWidth = frameImg.width * 0.4;
                    const maxPersonHeight = frameImg.height * 0.4;
                    
                    let newWidth = personImg.width;
                    let newHeight = personImg.height;

                    if (personImg.width > maxPersonWidth) {
                        newWidth = maxPersonWidth;
                        newHeight = (personImg.height * newWidth) / personImg.width;
                    }

                    if (newHeight > maxPersonHeight) {
                        newHeight = maxPersonHeight;
                        newWidth = (personImg.width * newHeight) / personImg.height;
                    }
                    
                    const x = (frameImg.width - newWidth) / 2;
                    const y = (frameImg.height - newHeight) / 2;

                    ctx.drawImage(personImg, x, y, newWidth, newHeight);
                };
            }
        };
    }, [frameImage, personImage]);

    useEffect(() => {
        drawImages();
    }, [drawImages]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'ket_qua_ghep_anh.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };
    
    const handleReset = () => {
        setFrameImage(null);
        setPersonImage(null);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const ImageInput: React.FC<{id: string, label: string, image: string | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ id, label, image, onChange }) => (
        <div className="w-full">
            <label htmlFor={id} className="block text-lg font-medium text-gray-300 mb-2">{label}</label>
            <div className="w-full h-48 bg-gray-900 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center relative overflow-hidden">
                {image ? (
                    <img src={image} alt={label} className="h-full w-full object-contain" />
                ) : (
                    <div className="text-center text-gray-500">
                        <UploadIcon className="h-8 w-8 mx-auto mb-2" />
                        <span>Nhấn để chọn ảnh</span>
                    </div>
                )}
                <input id={id} type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onChange} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-teal-400">Ghép Ảnh Bản Án</h2>
                <p className="mt-2 text-gray-400">Chọn ảnh khung kết án và ảnh chân dung để ghép chúng lại với nhau.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <ImageInput id="frame-upload" label="1. Chọn ảnh khung kết án" image={frameImage} onChange={handleImageUpload(setFrameImage)} />
                   <ImageInput id="person-upload" label="2. Chọn ảnh chân dung" image={personImage} onChange={handleImageUpload(setPersonImage)} />
                </div>
            </div>

            {(frameImage || personImage) && (
                 <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-teal-400 mb-4 text-center">Kết Quả</h3>
                    <div className="flex justify-center bg-gray-900 p-4 rounded-md">
                        <canvas ref={canvasRef} className="max-w-full h-auto rounded-md shadow-inner"></canvas>
                    </div>
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={!frameImage || !personImage}
                            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            Tải Xuống Ảnh
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 bg-red-800 text-white font-semibold rounded-md hover:bg-red-900 transition-all duration-200 transform hover:scale-105"
                        >
                            Làm Mới
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCombinerPage;
