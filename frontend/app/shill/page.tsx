import { AppLayout } from "../components/app-layout";

export default function ShillManagerPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-retro-green">
              Shill Manager
            </h1>
            <p className="text-gray-400">
              Manage your token promotion campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-black/40 backdrop-blur-sm border border-retro-green/20 rounded-lg p-6">
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-xl text-retro-green mb-4">
                  Shill Manager Coming Soon
                </p>
                <p className="text-gray-400 text-center">
                  Our shill management platform is currently under development.
                  Check back soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
