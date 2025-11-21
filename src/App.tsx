import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JsonTool } from './pages/JsonTool';
import { JsonDiffTool } from './pages/JsonDiffTool';
import { UuidTool } from './pages/UuidTool';
import { TimeTool } from './pages/TimeTool';
import { UrlTool } from './pages/UrlTool';
import { Base64Tool } from './pages/Base64Tool';
import { HashTool } from './pages/HashTool';
import { PasswordTool } from './pages/PasswordTool';
import { RegexTool } from './pages/RegexTool';
import { ColorTool } from './pages/ColorTool';
import { QrTool } from './pages/QrTool';
import { JwtTool } from './pages/JwtTool';
import { DiffTool } from './pages/DiffTool';
import { MarkdownTool } from './pages/MarkdownTool';
import { TextStatsTool } from './pages/TextStatsTool';
import { DeduplicateTool } from './pages/DeduplicateTool';
import { CsvJsonTool } from './pages/CsvJsonTool';
import { BaseConverterTool } from './pages/BaseConverterTool';
import { UnitConverterTool } from './pages/UnitConverterTool';
import { CronTool } from './pages/CronTool';
import { HtmlEntityTool } from './pages/HtmlEntityTool';
import { CaseConverterTool } from './pages/CaseConverterTool';
import { HttpStatusTool } from './pages/HttpStatusTool';
import { UnicodeTool } from './pages/UnicodeTool';
import { ImageBase64Tool } from './pages/ImageBase64Tool';
import { QrScannerTool } from './pages/QrScannerTool';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json" element={<JsonTool />} />
            <Route path="/json-diff" element={<JsonDiffTool />} />
            <Route path="/uuid" element={<UuidTool />} />
            <Route path="/time" element={<TimeTool />} />
            <Route path="/url" element={<UrlTool />} />
            <Route path="/base64" element={<Base64Tool />} />
            <Route path="/hash" element={<HashTool />} />
            <Route path="/password" element={<PasswordTool />} />
            <Route path="/regex" element={<RegexTool />} />
            <Route path="/color" element={<ColorTool />} />
            <Route path="/qr" element={<QrTool />} />
            <Route path="/jwt" element={<JwtTool />} />
            <Route path="/diff" element={<DiffTool />} />
            <Route path="/markdown" element={<MarkdownTool />} />
            <Route path="/text-stats" element={<TextStatsTool />} />
            <Route path="/deduplicate" element={<DeduplicateTool />} />
            <Route path="/csv-json" element={<CsvJsonTool />} />
            <Route path="/base-converter" element={<BaseConverterTool />} />
            <Route path="/unit-converter" element={<UnitConverterTool />} />
            <Route path="/cron" element={<CronTool />} />
            <Route path="/html-entity" element={<HtmlEntityTool />} />
            <Route path="/case-converter" element={<CaseConverterTool />} />
            <Route path="/http-status" element={<HttpStatusTool />} />
            <Route path="/unicode" element={<UnicodeTool />} />
            <Route path="/image-base64" element={<ImageBase64Tool />} />
            <Route path="/qr-scanner" element={<QrScannerTool />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
