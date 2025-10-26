export default function SidebarWidget() {
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-white px-5 py-6 text-center shadow-md dark:bg-gray-800">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Manage Your Properties Smartly
      </h3>
      <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
        Access insights, track listings, and manage properties efficiently — all
        in one intuitive dashboard.
      </p>
      <a
        href="/dashboard/upgrade"
        className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        Upgrade to Pro
      </a>
      <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Need help?{" "}
          <a
            href="/support"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
