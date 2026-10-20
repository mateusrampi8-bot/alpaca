# Gera icones PNG e capas OG da Veltrix Conceito (sem acentos no texto p/ evitar problemas de encoding)
Add-Type -AssemblyName System.Drawing

$out = 'C:\Users\Mateus Guollo\veltrix-site'

function New-Bitmap([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.PixelOffsetMode = 'HighQuality'
  return @($bmp, $g)
}

function Draw-V($g, [float]$x, [float]$y, [float]$size, $color) {
  # Desenha um "V" estilizado como poligono
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $w = $size * 0.92
  $thick = $size * 0.24
  $pts = New-Object System.Collections.Generic.List[System.Drawing.PointF]
  $pts.Add([System.Drawing.PointF]::new($x, $y))
  $pts.Add([System.Drawing.PointF]::new($x + $thick, $y))
  $pts.Add([System.Drawing.PointF]::new($x + $w/2, $y + $size*0.62))
  $pts.Add([System.Drawing.PointF]::new($x + $w - $thick, $y))
  $pts.Add([System.Drawing.PointF]::new($x + $w, $y))
  $pts.Add([System.Drawing.PointF]::new($x + $w/2 + $thick*0.55, $y + $size))
  $pts.Add([System.Drawing.PointF]::new($x + $w/2 - $thick*0.55, $y + $size))
  $p.AddPolygon($pts.ToArray())
  $g.FillPath($color, $p)
  $p.Dispose()
}

function Paint-Gradient($g, [int]$w, [int]$h, $c1, $c2) {
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0,0)),
    (New-Object System.Drawing.Point($w,$h)), $c1, $c2)
  $g.FillRectangle($brush, 0, 0, $w, $h)
  $brush.Dispose()
}

$ink   = [System.Drawing.Color]::FromArgb(255, 10, 10, 11)
$teal  = [System.Drawing.Color]::FromArgb(255, 15, 77, 82)
$orange= [System.Drawing.Color]::FromArgb(255, 255, 122, 47)
$white = [System.Drawing.Color]::FromArgb(255, 244, 245, 244)
$grey  = [System.Drawing.Color]::FromArgb(255, 154, 160, 163)
$paper = [System.Drawing.Color]::FromArgb(255, 246, 247, 246)
$petrol= [System.Drawing.Color]::FromArgb(255, 8, 46, 49)

# ---------- FAVICON 512x512 ----------
$b = New-Bitmap 512 512; $g = $b[1]
$g.Clear($ink)
$penBrush = New-Object System.Drawing.SolidBrush($teal)
$g.FillRectangle($penBrush, 0, 400, 512, 112)
Draw-V $g 120 120 280 (New-Object System.Drawing.SolidBrush($white))
$g.FillEllipse((New-Object System.Drawing.SolidBrush($orange)), 372, 96, 62, 62)
$g.Dispose(); $b[0].Save("$out\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- FAVICON 32x32 ----------
$b = New-Bitmap 32 32; $g = $b[1]
$g.Clear($ink)
Draw-V $g 7 8 18 (New-Object System.Drawing.SolidBrush($white))
$g.FillEllipse((New-Object System.Drawing.SolidBrush($orange)), 23, 5, 5, 5)
$g.Dispose(); $b[0].Save("$out\favicon-32.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- APPLE TOUCH 180x180 ----------
$b = New-Bitmap 180 180; $g = $b[1]
$g.Clear($ink)
Draw-V $g 42 44 96 (New-Object System.Drawing.SolidBrush($white))
$g.FillEllipse((New-Object System.Drawing.SolidBrush($orange)), 130, 34, 22, 22)
$g.Dispose(); $b[0].Save("$out\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- OG COVER (index, escuro) 1200x630 ----------
$b = New-Bitmap 1200 630; $g = $b[1]
Paint-Gradient $g 1200 630 $teal $ink
$brushOrange = New-Object System.Drawing.SolidBrush($orange)
$brushWhite  = New-Object System.Drawing.SolidBrush($white)
$brushGrey   = New-Object System.Drawing.SolidBrush($grey)
$g.FillRectangle($brushOrange, 0, 0, 1200, 14)
$fontTitle = New-Object System.Drawing.Font('Arial Black', 104)
$fontSub   = New-Object System.Drawing.Font('Arial', 28, [System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font('Arial', 21, [System.Drawing.FontStyle]::Regular)
$dot = [string][char]0xB7
$cricula = 'Crici' + [string][char]0xFA + 'ma'
$g.DrawString('VELTRIX', $fontTitle, $brushWhite, 90, 150)
$g.DrawString([string][char]0xB0 + 'CONCEITO', $fontTitle, $brushOrange, 90, 268)
$g.DrawString('STREETWEAR EM DROPS ' + $dot + ' ' + $cricula.ToUpper() + '/SC', $fontSub, $brushGrey, 96, 452)
$g.DrawString('Entrega motoboy no mesmo dia ' + $dot + ' Envio para todo o Brasil', $fontSmall, $brushGrey, 96, 502)
Draw-V $g 1000 418 120 $brushWhite
$g.Dispose(); $b[0].Save("$out\og-cover.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- OG COVER (sobre, claro) 1200x630 ----------
$b = New-Bitmap 1200 630; $g = $b[1]
Paint-Gradient $g 1200 630 $paper $petrol
$brushPaper = New-Object System.Drawing.SolidBrush($paper)
$brushInk   = New-Object System.Drawing.SolidBrush($ink)
$brushDark  = New-Object System.Drawing.SolidBrush($petrol)
$g.FillRectangle($brushOrange, 0, 0, 1200, 14)
$g.DrawString('VELTRIX', $fontTitle, $brushInk, 90, 150)
$g.DrawString([string][char]0xB0 + 'CONCEITO', $fontTitle, $brushOrange, 90, 268)
$g.DrawString('QUEM SOMOS ' + $dot + ' DIVISOES ' + $dot + ' ABRANGENCIA', $fontSub, $brushDark, 96, 452)
$g.DrawString('Streetwear com curadoria desde ' + $cricula + ' - SC', $fontSmall, $brushDark, 96, 502)
Draw-V $g 1000 418 120 $brushInk
$g.Dispose(); $b[0].Save("$out\og-cover-sobre.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

Get-ChildItem $out -Filter *.png | Select-Object Name, Length
