import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "Naeem_Electronics",
      in: window,
      launchOptions: launchOptions
    )

    preventScreenCapture()

    return true
  }

  private func preventScreenCapture() {
    guard let window = window else { return }
    let secureField = UITextField()
    secureField.isSecureTextEntry = true
    secureField.translatesAutoresizingMaskIntoConstraints = false
    window.addSubview(secureField)
    // Reparent the window layer under the secure text field's layer,
    // which causes iOS to blank the content in screenshots and screen recordings.
    secureField.layer.sublayers?.first.map { window.layer.superlayer?.addSublayer($0) }
    window.layer.superlayer?.addSublayer(window.layer)
    secureField.layer.addSublayer(window.layer)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
