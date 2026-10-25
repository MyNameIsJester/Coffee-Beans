$folder = "c:\Users\AORUS\OneDrive - 5swf15\Desktop\CoffeBeans"
$files = Get-ChildItem -Path $folder -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Replace all href="index.html" with href="index2.html" EXCEPT in logout/register.html context
    # For register.html: keep href="index.html" for back link
    # For logout: keep href="index.html"
    
    if ($file.Name -eq "register.html") {
        # In register.html, only replace in brand logo, not back link
        $content = $content -replace 'logo"><a href="index\.html"', 'logo"><a href="index2.html"'
    } else {
        # In all other files, replace all index.html with index2.html
        $content = $content -replace 'href="index\.html"', 'href="index2.html"'
    }
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated: $($file.Name)"
}

Write-Host "All files updated!"
