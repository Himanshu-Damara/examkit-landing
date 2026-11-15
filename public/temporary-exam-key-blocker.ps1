Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public class TemporaryExamKeyBlocker2026
{
    private delegate IntPtr HookProc(int nCode, IntPtr wParam, IntPtr lParam);

    private static HookProc callback = Hook;
    private static IntPtr hook = IntPtr.Zero;

    private static bool enabled = true;
    private static bool f12Held = false;

    private const int WH_KEYBOARD_LL = 13;

    private const int WM_KEYDOWN = 0x0100;
    private const int WM_KEYUP = 0x0101;
    private const int WM_SYSKEYDOWN = 0x0104;
    private const int WM_SYSKEYUP = 0x0105;

    private const int VK_TAB = 0x09;
    private const int VK_CONTROL = 0x11;
    private const int VK_SHIFT = 0x10;
    private const int VK_MENU = 0x12;
    private const int VK_LWIN = 0x5B;
    private const int VK_RWIN = 0x5C;
    private const int VK_F12 = 0x7B;

    [StructLayout(LayoutKind.Sequential)]
    private struct KBDLLHOOKSTRUCT
    {
        public uint vkCode;
        public uint scanCode;
        public uint flags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct POINT
    {
        public int x;
        public int y;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct MSG
    {
        public IntPtr hwnd;
        public uint message;
        public UIntPtr wParam;
        public IntPtr lParam;
        public uint time;
        public POINT pt;
    }

    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(
        int idHook, HookProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll")]
    private static extern IntPtr CallNextHookEx(
        IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll")]
    private static extern short GetAsyncKeyState(int vKey);

    [DllImport("user32.dll")]
    private static extern int GetMessage(
        out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax);

    [DllImport("user32.dll")]
    private static extern bool TranslateMessage(ref MSG lpMsg);

    [DllImport("user32.dll")]
    private static extern IntPtr DispatchMessage(ref MSG lpMsg);

    [DllImport("user32.dll")]
    private static extern void PostQuitMessage(int nExitCode);

    private static bool IsDown(int key)
    {
        return (GetAsyncKeyState(key) & 0x8000) != 0;
    }

    private static IntPtr Hook(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0)
        {
            KBDLLHOOKSTRUCT key =
                (KBDLLHOOKSTRUCT)Marshal.PtrToStructure(
                    lParam, typeof(KBDLLHOOKSTRUCT));

            bool down =
                wParam == (IntPtr)WM_KEYDOWN ||
                wParam == (IntPtr)WM_SYSKEYDOWN;

            bool up =
                wParam == (IntPtr)WM_KEYUP ||
                wParam == (IntPtr)WM_SYSKEYUP;

            // Reset F12 repeat protection when released
            if (up && key.vkCode == VK_F12)
            {
                f12Held = false;
            }

            if (down && key.vkCode == VK_F12 && !f12Held)
            {
                f12Held = true;

                bool ctrl = IsDown(VK_CONTROL);
                bool shift = IsDown(VK_SHIFT);
                bool alt = IsDown(VK_MENU);

                // Emergency exit: Ctrl + Alt + F12
                if (ctrl && alt)
                {
                    PostQuitMessage(0);
                    return (IntPtr)1;
                }

                // Toggle: Ctrl + Shift + F12
                if (ctrl && shift && !alt)
                {
                    enabled = !enabled;

                    Console.WriteLine(
                        enabled
                        ? "KEY BLOCKING: ON"
                        : "KEY BLOCKING: OFF");

                    return (IntPtr)1;
                }
            }

            if (enabled && down)
            {
                // Block left and right Windows keys
                if (key.vkCode == VK_LWIN ||
                    key.vkCode == VK_RWIN)
                {
                    return (IntPtr)1;
                }

                // Block Alt+Tab and Ctrl+Tab
                if (key.vkCode == VK_TAB)
                {
                    if (IsDown(VK_MENU) || IsDown(VK_CONTROL))
                    {
                        return (IntPtr)1;
                    }
                }
            }
        }

        return CallNextHookEx(
            hook, nCode, wParam, lParam);
    }

    public static void Run()
    {
        hook = SetWindowsHookEx(
            WH_KEYBOARD_LL,
            callback,
            IntPtr.Zero,
            0);

        if (hook == IntPtr.Zero)
        {
            throw new Exception(
                "Keyboard hook failed. Error: " +
                Marshal.GetLastWin32Error());
        }

        try
        {
            Console.WriteLine("--------------------------------");
            Console.WriteLine("TEMPORARY KEY BLOCKER STARTED");
            Console.WriteLine("--------------------------------");
            Console.WriteLine("Status: ON");
            Console.WriteLine("Ctrl + Shift + F12 = Toggle");
            Console.WriteLine("Ctrl + Alt + F12 = Exit");
            Console.WriteLine("--------------------------------");

            MSG message;

            while (GetMessage(
                out message, IntPtr.Zero, 0, 0) > 0)
            {
                TranslateMessage(ref message);
                DispatchMessage(ref message);
            }
        }
        finally
        {
            UnhookWindowsHookEx(hook);
            hook = IntPtr.Zero;

            Console.WriteLine("KEY BLOCKER STOPPED");
        }
    }
}
'@

[TemporaryExamKeyBlocker2026]::Run()
