const ProjectCardSkeleton = () => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
      {/* Glassy Card Background */}
      <div className="w-full h-[400px] bg-black/30 glass-shimmer relative overflow-hidden backdrop-blur-lg">
        {/* Content overlay with glassy effect */}
        <div className="absolute inset-0 flex flex-col p-6 bg-black/20">
          {/* Button shimmer - centered */}
          <div className="w-1/2 h-10 rounded glass-shimmer mx-auto mt-[45%]"></div>

          {/* Title shimmer - bottom left */}
          <div className="w-3/4 h-8 rounded glass-shimmer mt-auto self-start"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
