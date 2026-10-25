# Sync header from index2.html to all end-user HTML files

$folder = "c:\Users\AORUS\OneDrive - 5swf15\Desktop\CoffeBeans"
$index2Path = Join-Path $folder "index2.html"

# Files to sync (all end-user pages except index.html, index2.html, and admin pages)
$targetFiles = @(
    "arabica.html",
    "cart.html",
    "checkout.html",
    "order-confirmation.html",
    "order-history.html",
    "product-detail.html",
    "products.html",
    "profile.html",
    "register.html"
)

# Read index2.html
$index2Content = Get-Content -Path $index2Path -Raw -Encoding UTF8

# Extract header from index2.html (from <header> to </header>)
$headerPattern = '<header[^>]*>.*?</header>'
$headerMatch = [regex]::Match($index2Content, $headerPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)

if ($headerMatch.Success) {
    $newHeader = $headerMatch.Value
    Write-Host "Extracted header from index2.html"
    
    # Also extract Font Awesome link
    $fontAwesomePattern = '<!-- Nhúng Font Awesome -->.*?<link[^>]*font-awesome[^>]*>'
    $fontAwesomeMatch = [regex]::Match($index2Content, $fontAwesomePattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $fontAwesomeLink = if ($fontAwesomeMatch.Success) { $fontAwesomeMatch.Value } else { "" }
    
    # Extract account dropdown CSS
    $cssPattern = '<style>.*?<!-- Account dropdown.*?</style>'
    $cssMatch = [regex]::Match($index2Content, $cssPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $accountCSS = if ($cssMatch.Success) { $cssMatch.Value } else { "" }
    
    # Extract account dropdown JavaScript
    $scriptPattern = '<script>.*?// Initialize logged-in user view.*?</script>'
    $scriptMatch = [regex]::Match($index2Content, $scriptPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $accountJS = if ($scriptMatch.Success) { $scriptMatch.Value } else { "" }
    
    # Sync to all target files
    foreach ($file in $targetFiles) {
        $filePath = Join-Path $folder $file
        if (Test-Path $filePath) {
            $content = Get-Content -Path $filePath -Raw -Encoding UTF8
            
            # Replace header
            $oldHeaderPattern = '<header[^>]*>.*?</header>'
            $oldHeaderMatch = [regex]::Match($content, $oldHeaderPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
            if ($oldHeaderMatch.Success) {
                $content = $content.Replace($oldHeaderMatch.Value, $newHeader)
                Write-Host "Updated header in $file"
            }
            
            # Replace Font Awesome link if needed
            if ($fontAwesomeLink -and -not ($content -match 'font-awesome.*?css/all\.min\.css')) {
                $content = $content -replace '(</header>)', "$fontAwesomeLink`n`1"
                Write-Host "Added Font Awesome link to $file"
            }
            
            # Save updated content
            Set-Content -Path $filePath -Value $content -Encoding UTF8
        } else {
            Write-Host "File not found: $filePath"
        }
    }
    
    Write-Host "`nHeader sync completed!"
} else {
    Write-Host "Could not find header in index2.html"
}
