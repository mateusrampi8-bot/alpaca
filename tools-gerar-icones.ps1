# Gera icones PNG e capas OG da marca ALPACA (sem acentos no texto p/ evitar problemas de encoding)
Add-Type -AssemblyName System.Drawing

$out = 'C:\Users\Mateus Guollo\alpaca'

function New-Bitmap([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.PixelOffsetMode = 'HighQuality'
  return @($bmp, $g)
}

function Draw-A($g, [float]$x, [float]$y, [float]$size, $color) {
  # Letra "A" geometrica como poligono (com contraforma)
  $s = $size / 64.0
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $pts = New-Object System.Collections.Generic.List[System.Drawing.PointF]
  # contorno externo (com vacogo entre as pernas abaixo da travessa)
  $pts.Add([System.Drawing.PointF]::new($x + 32*$s, $y + 8*$s))
  $pts.Add([System.Drawing.PointF]::new($x + 56*$s, $y + 56*$s))
  $pts.Add([System.Drawing.PointF]::new($x + 44*$s, $y + 56*$s))
  $pts.Add([System.Drawing.PointF]::new($x + 38.5*$s, $y + 44*$s))
  $pts.Add([System.Drawing.PointF]::new($x + 25.5*$s, $y + 44*$s))
  $pts.Add([System.Drawing.PointF]::new($x + 20*$s, $y + 56*$s))
  $pts.Add([System.Drawing.PointF]::new($x + 8*$s,  $y + 56*$s))
  $p.StartFigure()
  $p.AddPolygon($pts.ToArray())
  # contraforma triangular
  $pts2 = New-Object System.Collections.Generic.List[System.Drawing.PointF]
  $pts2.Add([System.Drawing.PointF]::new($x + 32*$s, $y + 24*$s))
  $pts2.Add([System.Drawing.PointF]::new($x + 26*$s, $y + 40*$s))
  $pts2.Add([System.Drawing.PointF]::new($x + 38*$s, $y + 40*$s))
  $p.StartFigure()
  $p.AddPolygon($pts2.ToArray())
  # grau (ponto laranja no canto superior direito)
  $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 122, 47))
  $dotR = 5.5 * $s
  $g.FillEllipse($dotBrush, $x + 52*$s - $dotR/2, $y + 15*$s - $dotR/2, $dotR, $dotR)
  $dotBrush.Dispose()
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
$panel = [System.Drawing.Color]::FromArgb(255, 15, 16, 18)
$orange= [System.Drawing.Color]::FromArgb(255, 255, 122, 47)
$white = [System.Drawing.Color]::FromArgb(255, 244, 245, 244)
$grey  = [System.Drawing.Color]::FromArgb(255, 139, 144, 147)
$petrol= [System.Drawing.Color]::FromArgb(255, 8, 46, 49)

$brushWhite = New-Object System.Drawing.SolidBrush($white)
$brushGrey  = New-Object System.Drawing.SolidBrush($grey)
$brushInk   = New-Object System.Drawing.SolidBrush($ink)
$brushOrange= New-Object System.Drawing.SolidBrush($orange)

# ---------- FAVICON 512x512 ----------
$b = New-Bitmap 512 512; $g = $b[1]
$g.Clear($ink)
Draw-A $g 128 128 256 $brushWhite
$g.Dispose(); $b[0].Save("$out\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- FAVICON 32x32 ----------
$b = New-Bitmap 32 32; $g = $b[1]
$g.Clear($ink)
Draw-A $g 4 4 24 $brushWhite
$g.Dispose(); $b[0].Save("$out\favicon-32.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- APPLE TOUCH 180x180 ----------
$b = New-Bitmap 180 180; $g = $b[1]
$g.Clear($ink)
Draw-A $g 45 45 90 $brushWhite
$g.Dispose(); $b[0].Save("$out\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- OG COVER (home, escuro) 1200x630 ----------
$fontTitle = New-Object System.Drawing.Font('Arial', 132, [System.Drawing.FontStyle]::Bold)
$fontSub   = New-Object System.Drawing.Font('Arial', 26, [System.Drawing.FontStyle]::Regular)
$fontSmall = New-Object System.Drawing.Font('Arial', 20, [System.Drawing.FontStyle]::Regular)

$b = New-Bitmap 1200 630; $g = $b[1]
Paint-Gradient $g 1200 630 $panel $ink
$g.FillRectangle($brushOrange, 0, 0, 1200, 8)
$g.DrawString('ALPACA', $fontTitle, $brushWhite, 90, 170)
$sz = $g.MeasureString('ALPACA', $fontTitle)
$g.DrawString([string][char]0xB0, $fontTitle, $brushOrange, 90 + $sz.Width + 4, 170)
$dot = [string][char]0xB7
$cricula = 'Crici' + [string][char]0xFA + 'ma'
$g.DrawString('STREETWEAR EM DROPS ' + $dot + ' ' + $cricula.ToUpper() + '/SC', $fontSub, $brushGrey, 96, 380)
$g.DrawString('Curadoria em drops ' + $dot + ' Entrega motoboy no mesmo dia ' + $dot + ' Envio pra todo o Brasil', $fontSmall, $brushGrey, 96, 428)
Draw-A $g 1040 470 110 $brushWhite
$g.Dispose(); $b[0].Save("$out\og-cover.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

# ---------- OG COVER (sobre) 1200x630 ----------
$b = New-Bitmap 1200 630; $g = $b[1]
Paint-Gradient $g 1200 630 $ink $petrol
$g.FillRectangle($brushOrange, 0, 0, 1200, 8)
$g.DrawString('ALPACA', $fontTitle, $brushWhite, 90, 170)
$sz = $g.MeasureString('ALPACA', $fontTitle)
$g.DrawString([string][char]0xB0, $fontTitle, $brushOrange, 90 + $sz.Width + 4, 170)
$g.DrawString('QUEM SOMOS ' + $dot + ' DIVISOES ' + $dot + ' ABRANGENCIA', $fontSub, $brushGrey, 96, 380)
$g.DrawString('Streetwear com curadoria desde ' + $cricula + ' - SC', $fontSmall, $brushGrey, 96, 428)
Draw-A $g 1040 470 110 $brushWhite
$g.Dispose(); $b[0].Save("$out\og-cover-sobre.png", [System.Drawing.Imaging.ImageFormat]::Png); $b[0].Dispose()

Get-ChildItem $out -Filter *.png | Select-Object Name, Length
