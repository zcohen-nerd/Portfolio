# Generates page-specific 1200x630 Open Graph cards into static/img/og/.
# Zero dependencies (Windows GDI+), same visual language as the site-wide
# card (scripts/generate-og-image.ps1). Re-run after adding a page below.
#   powershell -File scripts/generate-og-pages.ps1

Add-Type -AssemblyName System.Drawing

$pages = @(
  @{file='og-sentry-v3.png';            title='SENTRY V3';            sub='Deployed mechatronics platform';                         accent='#e11d48'},
  @{file='og-spark.png';                title='SPARK';                sub='Hardened STLINK-V3MODS interface board';                 accent='#7c3aed'},
  @{file='og-fusion-system-blocks.png'; title='Fusion System Blocks'; sub='System block diagrams inside Autodesk Fusion';           accent='#d97706'},
  @{file='og-teaching.png';             title='Teaching';             sub='Curriculum projects & engineering education';            accent='#2e8555'},
  @{file='og-writing-research.png';     title='Writing & Research';   sub='Publications, presentations, and essays';                accent='#0d9488'},
  @{file='og-frc.png';                  title='FIRST Robotics';       sub='Two decades of mentoring, judging & event operations';   accent='#2563eb'}
)

$outDir = Join-Path $PSScriptRoot '..\static\img\og'
New-Item -ItemType Directory -Force $outDir | Out-Null

foreach ($p in $pages) {
  $w = 1200; $h = 630
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.ColorTranslator]::FromHtml('#0a1428'),
    [System.Drawing.ColorTranslator]::FromHtml('#1b3358'),
    35.0)
  $g.FillRectangle($bg, $rect)

  $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glowPath.AddEllipse(760, -320, 760, 760)
  $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
  $glow.CenterColor = [System.Drawing.Color]::FromArgb(70, 16, 184, 216)
  $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 16, 184, 216))
  $g.FillPath($glow, $glowPath)
  $glowPath.Dispose()

  $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $accent = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($p.accent))
  $sub = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#aebed1'))
  $faint = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#7f95b3'))
  $amber = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#f8c840'))
  $fmt = [System.Drawing.StringFormat]::GenericTypographic
  $margin = 90.0

  # Accent bar in the page's signature color
  $g.FillRectangle($accent, [single]$margin, 118, 76, 10)

  # Page title — shrink to fit if long
  $size = 88
  do {
    $titleFont = New-Object System.Drawing.Font('Segoe UI', $size, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $tw = $g.MeasureString($p.title, $titleFont, [System.Drawing.PointF]::new(0, 0), $fmt).Width
    if ($tw -le ($w - 2 * $margin)) { break }
    $titleFont.Dispose(); $size -= 4
  } while ($size -gt 40)
  $g.DrawString($p.title, $titleFont, $white, [single]$margin, 180, $fmt)

  $subFont = New-Object System.Drawing.Font('Segoe UI', 40, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString($p.sub, $subFont, $sub, [single]$margin, 330, $fmt)

  $g.FillEllipse($amber, [single]$margin, 520, 14, 14)
  $attrFont = New-Object System.Drawing.Font('Segoe UI', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $dot = ' ' + [char]0x00B7 + ' '
  $g.DrawString('Zac Cohen Portfolio' + $dot + 'portfolio.zcohen-nerd.com', $attrFont, $faint, [single]($margin + 28), 511, $fmt)

  $out = Join-Path $outDir $p.file
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Output ("wrote {0}" -f $p.file)
}
