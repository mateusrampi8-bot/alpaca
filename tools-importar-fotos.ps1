# Processa as fotos da pasta OneDrive para o site: 2 vao pros produtos, 7 vao pra galeria lookbook
Add-Type -AssemblyName System.Drawing

$src = 'C:\Users\Mateus Guollo\OneDrive\Documentos\fotos site'
$dstProd = 'C:\Users\Mateus Guollo\alpaca\img\produtos'
$dstLook = 'C:\Users\Mateus Guollo\alpaca\img\lookbook'
New-Item -ItemType Directory -Force -Path $dstLook | Out-Null

# mapeamento: arquivo origem -> destino
$map = @{
  # fotos dos produtos
  'WhatsApp Image 2026-10-20 at 21.43.06.jpeg'      = @($dstProd, 'tee-jacare.jpg')
  'WhatsApp Image 2026-10-20 at 21.43.0611.jpeg'    = @($dstProd, 'tee-listra.jpg')
  # galeria lookbook
  'WhatsApp Image 2026-10-20 at 21.43.08266.jpeg'   = @($dstLook, 'lb-01.jpg')  # dupla
  'WhatsApp Image 2026-10-20 at 21.43.0611111.jpeg' = @($dstLook, 'lb-02.jpg')  # branca na cadeira
  'WhatsApp Image 2026-10-20 at 21.43.0723.jpeg'    = @($dstLook, 'lb-03.jpg')  # preta no bau
  'WhatsApp Image 2026-10-20 at 21.43.07455.jpeg'   = @($dstLook, 'lb-04.jpg')  # branca com casaco
  'WhatsApp Image 2026-10-20 at 21.43.0948.jpeg'    = @($dstLook, 'lb-05.jpg')  # preta estudio
  'WhatsApp Image 2026-10-20 at 21.43.095669.jpeg'  = @($dstLook, 'lb-06.jpg')  # verde
  'WhatsApp Image 2026-10-20 at 21.43.08656.jpeg'   = @($dstLook, 'lb-07.jpg')  # branca olhando longe
}

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)

foreach ($file in $map.Keys) {
  $from = Join-Path $src $file
  if (!(Test-Path $from)) { Write-Host "AUSENTE: $file"; continue }
  $target = $map[$file]
  $to = Join-Path $target[0] $target[1]

  $img = [System.Drawing.Image]::FromFile($from)
  # corrige orientacao EXIF (fotos de celular)
  $orient = 1
  try { $prop = $img.GetPropertyItem(274); if ($prop) { $orient = $prop.Value[0] } } catch {}
  switch ($orient) {
    2 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipHorizontal) }
    3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
    4 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipVertical) }
    6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
  }
  $bmp = New-Object System.Drawing.Bitmap($img)
  $bmp.Save($to, $enc, $ep)
  $bmp.Dispose(); $img.Dispose()

  $info = Get-Item $to
  $check = [System.Drawing.Image]::FromFile($to)
  Write-Host ("{0} -> {1}x{2}, {3} KB" -f $target[1], $check.Width, $check.Height, [math]::Round($info.Length/1KB,1))
  $check.Dispose()
}
