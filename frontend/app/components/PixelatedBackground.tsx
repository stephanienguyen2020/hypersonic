const PixelatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] opacity-10">
      <div className="absolute inset-0 bg-grid-green-400/30 bg-grid-8 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
    </div>
  );
};

export default PixelatedBackground;
